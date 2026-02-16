import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto, CreateTestSchema } from './dto/create-test.dto';
import { UpdateTestDto, UpdateTestSchema } from './dto/update-test.dto';
import { MoveTestDto, MoveTestSchema } from './dto/move-test.dto';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { Test as TestModel } from './schemas/test.schema';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  // Создание теста
  @Post()
  @UsePipes(new JoiValidationPipe(CreateTestSchema))
  async create(@Body() createTestDto: CreateTestDto): Promise<TestModel> {
    return this.testsService.create(createTestDto, createTestDto.parentId);
  }

  // Получение одного теста по id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TestModel> {
    return this.testsService.findOne(id);
  }

  // Обновление теста
  @Patch(':id')
  @UsePipes(new JoiValidationPipe(UpdateTestSchema))
  async update(
    @Param('id') id: string,
    @Body() updateTestDto: UpdateTestDto,
  ): Promise<TestModel> {
    return this.testsService.update(id, updateTestDto);
  }

  // Удаление теста
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.testsService.remove(id);
    return { success: true };
  }

  // Перемещение теста
  @Patch(':id/move')
  @UsePipes(new JoiValidationPipe(MoveTestSchema))
  async move(
    @Param('id') id: string,
    @Body() moveTestDto: MoveTestDto,
  ): Promise<TestModel> {
    // На всякий случай устанавливаем id из параметра
    moveTestDto.testId = id;
    return this.testsService.move(moveTestDto);
  }

  // Получение полного дерева тестов по проекту
  @Get('/project/:projectId/tree')
  async getProjectTree(@Param('projectId') projectId: string): Promise<TestModel[]> {
    return this.testsService.getProjectTree(projectId);
  }
}