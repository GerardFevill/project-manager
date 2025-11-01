import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomReportsService } from './custom-reports.service';
import { CreateCustomReportDto } from './dto/create-custom-reports.dto';
import { UpdateCustomReportDto } from './dto/update-custom-reports.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('custom-reports')
@Controller('custom-reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomReportsController {
  constructor(private readonly service: CustomReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateCustomReportDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomReportDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
