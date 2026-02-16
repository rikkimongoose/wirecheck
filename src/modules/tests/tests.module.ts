import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestSchema } from './schemas/test.schema';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { TreeService } from './services/tree.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  providers: [TestsService, TreeService],
  controllers: [TestsController],
  exports: [
    TestsService,           // если кто-то ещё будет его использовать
    MongooseModule,         // <- вот это важно: экспортируем модели
    TreeService,
  ],
})
export class TestsModule {}