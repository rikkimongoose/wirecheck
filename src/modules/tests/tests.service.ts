import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestEntity, TestDocument } from './schemas/test.schema';
import { TreeService } from './services/tree.service';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(TestEntity.name) private readonly testModel: Model<TestDocument>,
    private readonly treeService: TreeService
  ) {}

  async create(projectId: string, parentId: string | null, dto: any) {
    const path = parentId
      ? `${(await this.testModel.findById(parentId))?.path}/${new this.testModel()._id}`
      : `${new this.testModel()._id}`;

    const created = new this.testModel({ ...dto, projectId, parentId, path });
    return created.save();
  }

  async findOne(id: string) {
    const test = await this.testModel.findById(id);
    if (!test) throw new NotFoundException(`Test ${id} not found`);
    return test;
  }

  async update(id: string, dto: any) {
    const updated = await this.testModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException(`Test ${id} not found`);
    return updated;
  }

  async remove(id: string) {
    const test = await this.testModel.findById(id);
    if (!test) throw new NotFoundException(`Test ${id} not found`);
    test.deletedAt = new Date();
    await test.save();
    return { deleted: true };
  }

  async move(id: string, newParentId: string | null) {
    return this.treeService.move(id, newParentId);
  }

  async getSubtree(rootId: string) {
    return this.treeService.getSubtree(rootId);
  }
}