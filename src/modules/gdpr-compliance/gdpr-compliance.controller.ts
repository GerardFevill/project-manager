import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GdprComplianceService } from './gdpr-compliance.service';
import { CreateGdprLogDto } from './dto/create-gdpr-compliance.dto';
import { UpdateGdprLogDto } from './dto/update-gdpr-compliance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('gdpr-compliance')
@Controller('gdpr-compliance')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GdprComplianceController {
  constructor(private readonly service: GdprComplianceService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateGdprLogDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateGdprLogDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
