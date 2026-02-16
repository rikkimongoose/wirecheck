import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from './modules/projects/projects.module';
import { TestsModule } from './modules/tests/tests.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL || 'mongodb://localhost:27017/wirecheck'),
    ProjectsModule,
    TestsModule,
    SeedModule, // <- теперь SeedService доступен
  ],
})
export class AppModule {}