import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../modules/projects/schemas/project.schema';
import { Test } from '../modules/tests/schemas/test.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Test.name) private testModel: Model<Test>,
  ) {}

  async run() {
    await this.projectModel.deleteMany({});
    await this.testModel.deleteMany({});

    const project = await this.projectModel.create({
      name: 'Demo project',
      description: 'Seeded project',
      envs: {
        dev: { url: 'http://localhost:3000' }
      }
    });

    await this.testModel.create({
      name: 'Health check',
      path: '/health',
      method: 'GET',
      project: project._id
    });

    console.log('✅ Seeding complete');
  }
}