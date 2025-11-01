import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { CreateScheduledJobDto } from './dto/create-scheduled-jobs.dto';
import { UpdateScheduledJobDto } from './dto/update-scheduled-jobs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('scheduled-jobs')
@Controller('scheduled-jobs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduledJobsController {
  constructor(private readonly service: ScheduledJobsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateScheduledJobDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateScheduledJobDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
