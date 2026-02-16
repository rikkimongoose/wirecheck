import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './schemas/test.schema';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { MoveTestDto } from './dto/move-test.dto';
import { TreeService } from './services/tree.service';

@Injectable()
export class TestsService {
  constructor(
    @InjectModel(Test.name) private testModel: Model<Test>,
    private treeService: TreeService,
  ) {}

  // Создание теста (с опциональным parentId)
  async create(createTestDto: CreateTestDto, parentId?: string): Promise<Test> {
    const test = new this.testModel(createTestDto);
    await test.save();

    if (parentId) {
      const rootTree = await this.getProjectTree(createTestDto.projectId);
      this.treeService.moveNode(rootTree, test, parentId);
      await this.saveTree(rootTree);
    }

    return test;
  }

  // Получение одного теста по id
  async findOne(id: string): Promise<Test> {
    const test = await this.testModel.findById(id).populate('tests').exec();
    if (!test) throw new NotFoundException(`Test ${id} not found`);
    return test;
  }

  // Обновление теста
  async update(id: string, updateTestDto: UpdateTestDto): Promise<Test> {
    const test = await this.testModel.findByIdAndUpdate(id, updateTestDto, { new: true }).exec();
    if (!test) throw new NotFoundException(`Test ${id} not found`);
    return test;
  }

  // Удаление теста (и всех дочерних)
  async remove(id: string): Promise<void> {
    const test = await this.testModel.findById(id).exec();
    if (!test) throw new NotFoundException(`Test ${id} not found`);

    // Получаем всё дерево проекта
    const tree = await this.getProjectTree(test.project.toString());
    this.deleteNodeFromTree(tree, test._id.toString());
    await this.saveTree(tree);

    // Удаляем сам тест
    await this.testModel.deleteOne({ _id: id }).exec();
  }

  // Перемещение теста
  async move(moveDto: MoveTestDto): Promise<Test> {
    const { testId, newParentId, newIndex } = moveDto;

    const test = await this.testModel.findById(testId).exec();
    if (!test) throw new NotFoundException(`Test ${testId} not found`);

    const tree = await this.getProjectTree(test.project.toString());
    this.treeService.moveNode(tree, test, newParentId ?? null, newIndex);
    await this.saveTree(tree);

    return test;
  }

  // Получение всех тестов проекта в виде дерева
  async getProjectTree(projectId: string): Promise<Test[]> {
    const tests = await this.testModel.find({ project: projectId }).exec();
    // Корневые тесты — без родителя
    const roots = tests.filter(t => !this.treeService.findParent(tests, t._id.toString()));
    return roots;
  }

  /** Вспомогательный метод: рекурсивное удаление узла из дерева */
  private deleteNodeFromTree(tree: Test[], nodeId: string) {
    for (let i = tree.length - 1; i >= 0; i--) {
      const node = tree[i];
      if (node._id.toString() === nodeId) {
        tree.splice(i, 1);
      } else if (node.tests?.length) {
        this.deleteNodeFromTree(node.tests, nodeId);
      }
    }
  }

  /** Вспомогательный метод: сохраняет все узлы дерева */
  private async saveTree(tree: Test[]) {
    for (const node of tree) {
      await node.save();
      if (node.tests?.length) {
        await this.saveTree(node.tests);
      }
    }
  }
}