import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('components')
@Controller('components')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all components' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of components' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.componentsService.findAll(projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all components for a project' })
  @ApiResponse({ status: 200, description: 'Returns list of components' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.componentsService.findByProject(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get component by ID' })
  @ApiResponse({ status: 200, description: 'Returns component details' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  async findOne(@Param('id') id: string) {
    return this.componentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new component' })
  @ApiResponse({ status: 201, description: 'Component successfully created' })
  @ApiResponse({ status: 409, description: 'Component name already exists' })
  async create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update component by ID' })
  @ApiResponse({ status: 200, description: 'Component successfully updated' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  async update(@Param('id') id: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete component by ID' })
  @ApiResponse({ status: 204, description: 'Component successfully deleted' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  async remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive component' })
  @ApiResponse({ status: 200, description: 'Component successfully archived' })
  async archive(@Param('id') id: string) {
    return this.componentsService.archive(id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive component' })
  @ApiResponse({ status: 200, description: 'Component successfully unarchived' })
  async unarchive(@Param('id') id: string) {
    return this.componentsService.unarchive(id);
  }
}
