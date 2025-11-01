import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SLAService } from './sla.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('sla')
@Controller('sla')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SLAController {
  constructor(private readonly slaService: SLAService) {}

  @Post()
  @ApiOperation({ summary: 'Create SLA' })
  @ApiResponse({ status: 201, description: 'SLA created' })
  async create(@Body() data: any) {
    return this.slaService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SLAs' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.slaService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get SLA by ID' })
  async findOne(@Param('id') id: string) {
    return this.slaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update SLA' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.slaService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete SLA' })
  async remove(@Param('id') id: string) {
    await this.slaService.remove(id);
  }
}
