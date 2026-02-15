import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { TreeService } from './services/tree.service';
import { TestEntity, TestSchema } from './schemas/test.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TestEntity.name, schema: TestSchema }]),
  ],
  controllers: [TestsController],
  providers: [TestsService, TreeService],
  exports: [TestsService, TreeService],
})
export class TestsModule {}
