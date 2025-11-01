import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResourceAllocationService } from './resource-allocation.service';
import { CreateResourceAllocationDto } from './dto/create-resource-allocation.dto';
import { UpdateResourceAllocationDto } from './dto/update-resource-allocation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('resource-allocation')
@Controller('resource-allocation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResourceAllocationController {
  constructor(private readonly service: ResourceAllocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create resource-allocation' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateResourceAllocationDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resource-allocation' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource-allocation by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update resource-allocation' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateResourceAllocationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete resource-allocation' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
