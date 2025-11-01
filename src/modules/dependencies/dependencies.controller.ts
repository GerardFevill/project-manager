import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DependenciesService } from './dependencies.service';
import { CreateDependencyDto } from './dto/create-dependencies.dto';
import { UpdateDependencyDto } from './dto/update-dependencies.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dependencies')
@Controller('dependencies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DependenciesController {
  constructor(private readonly service: DependenciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create dependencies' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateDependencyDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all dependencies' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dependencies by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dependencies' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateDependencyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete dependencies' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
