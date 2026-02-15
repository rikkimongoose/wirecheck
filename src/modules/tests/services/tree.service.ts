import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TestEntity, TestDocument } from '../schemas/test.schema';

@Injectable()
export class TreeService {
  constructor(
    @InjectModel(TestEntity.name) private readonly testModel: Model<TestDocument>
  ) {}

  async move(testId: string, newParentId: string | null) {
    const node = await this.testModel.findById(testId);
    if (!node) throw new Error('Test not found');

    const oldPath = node.path;
    let newPath = newParentId ? `${(await this.testModel.findById(newParentId)).path}/${node._id}` : `${node._id}`;

    await this.testModel.updateMany(
      { path: { $regex: `^${oldPath}` } },
      [
        {
          $set: {
            path: { $replaceOne: { input: "$path", find: oldPath, replacement: newPath } }
          }
        }
      ]
    );

    node.parentId = newParentId;
    node.path = newPath;
    await node.save();
    return node;
  }

  async getSubtree(rootId: string) {
    const root = await this.testModel.findById(rootId);
    if (!root) throw new Error('Root test not found');

    const nodes = await this.testModel.find({ path: { $regex: `^${root.path}` } }).sort('path').exec();
    return nodes;
  }
}