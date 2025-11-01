import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DataRetentionService } from './data-retention.service';
import { CreateDataRetentionDto } from './dto/create-data-retention.dto';
import { UpdateDataRetentionDto } from './dto/update-data-retention.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('data-retention')
@Controller('data-retention')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DataRetentionController {
  constructor(private readonly service: DataRetentionService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateDataRetentionDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateDataRetentionDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
