import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportTemplatesService } from './report-templates.service';
import { CreateReportTemplateDto } from './dto/create-report-templates.dto';
import { UpdateReportTemplateDto } from './dto/update-report-templates.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('report-templates')
@Controller('report-templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportTemplatesController {
  constructor(private readonly service: ReportTemplatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateReportTemplateDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateReportTemplateDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
