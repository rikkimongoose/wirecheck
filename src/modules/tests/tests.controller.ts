import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestSchema } from './dto/create-test.dto';
import { MoveTestSchema } from './dto/move-test.dto';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';

@Controller('api/tests')
export class TestsController {
  constructor(private readonly service: TestsService) {}

  @Post('project/:projectId')
  async createRoot(@Param('projectId') projectId: string, @Body(new JoiValidationPipe(CreateTestSchema)) dto: any) {
    return this.service.create(projectId, null, dto);
  }

  @Post(':parentId/children')
  async createChild(@Param('parentId') parentId: string, @Body(new JoiValidationPipe(CreateTestSchema)) dto: any) {
    const parent = await this.service.findOne(parentId);
    return this.service.create(parent.projectId, parentId, dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(new JoiValidationPipe(CreateTestSchema)) dto: any) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/move')
  async move(@Param('id') id: string, @Body(new JoiValidationPipe(MoveTestSchema)) body: any) {
    return this.service.move(id, body.newParentId);
  }

  @Get(':id/subtree')
  async getSubtree(@Param('id') id: string) {
    return this.service.getSubtree(id);
  }
}