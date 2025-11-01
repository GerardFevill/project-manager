import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';
import { CreateKnowledgeArticleDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeArticleDto } from './dto/update-knowledge-base.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('knowledge-base')
@Controller('knowledge-base')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KnowledgeBaseController {
  constructor(private readonly service: KnowledgeBaseService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateKnowledgeArticleDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateKnowledgeArticleDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
