import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Test } from '../tests/schemas/test.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Test.name) private testModel: Model<Test>,
  ) {}

  // Создание проекта
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new this.projectModel(createProjectDto);
    return project.save();
  }

  // Получение всех проектов
  async findAll(): Promise<Project[]> {
    return this.projectModel.find().populate('tests').exec();
  }

  // Получение одного проекта по id
  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).populate('tests').exec();
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    return project;
  }

  // Обновление проекта
  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('tests')
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    project.changedAt = new Date();
    await project.save();
    return project;
  }

  // Удаление проекта
  async remove(id: string): Promise<void> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    // Также удаляем все дочерние тесты
    if (project.tests?.length) {
      await this.testModel.deleteMany({ _id: { $in: project.tests.map(t => t._id) } }).exec();
    }

    await this.projectModel.deleteOne({ _id: id }).exec();
  }

  // Переименование проекта
  async rename(id: string, newName: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
    project.name = newName;
    project.changedAt = new Date();
    return project.save();
  }
}