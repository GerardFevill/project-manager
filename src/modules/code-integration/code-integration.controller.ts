import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CodeIntegrationService } from './code-integration.service';
import { CreateCodeCommitDto } from './dto/create-code-integration.dto';
import { UpdateCodeCommitDto } from './dto/update-code-integration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('code-integration')
@Controller('code-integration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CodeIntegrationController {
  constructor(private readonly service: CodeIntegrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateCodeCommitDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateCodeCommitDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
