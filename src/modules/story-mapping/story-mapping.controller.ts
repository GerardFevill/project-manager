import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StoryMappingService } from './story-mapping.service';
import { CreateStoryMapDto } from './dto/create-story-mapping.dto';
import { UpdateStoryMapDto } from './dto/update-story-mapping.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('story-mapping')
@Controller('story-mapping')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StoryMappingController {
  constructor(private readonly service: StoryMappingService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateStoryMapDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateStoryMapDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
