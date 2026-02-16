import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectSchema } from './dto/create-project.dto';
import { UpdateProjectSchema } from './dto/update-project.dto';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';

@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get()
  async list() {
    return this.service.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body(new JoiValidationPipe(CreateProjectSchema)) dto: any) {
    return this.service.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateProjectSchema)) dto: any
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.remove(id);
  }
}