import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoadmapsService } from './roadmaps.service';
import { CreateRoadmapDto } from './dto/create-roadmaps.dto';
import { UpdateRoadmapDto } from './dto/update-roadmaps.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('roadmaps')
@Controller('roadmaps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoadmapsController {
  constructor(private readonly service: RoadmapsService) {}

  @Post()
  @ApiOperation({ summary: 'Create roadmaps' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateRoadmapDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roadmaps' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get roadmaps by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update roadmaps' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateRoadmapDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete roadmaps' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
