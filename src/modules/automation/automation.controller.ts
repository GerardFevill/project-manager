import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationService } from './automation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('automation')
@Controller('automation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post()
  @ApiOperation({ summary: 'Create automation rule' })
  async create(@Body() data: any) {
    return this.automationService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all automation rules' })
  async findAll(@Query('projectId') projectId?: string) {
    return this.automationService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get automation rule by ID' })
  async findOne(@Param('id') id: string) {
    return this.automationService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update automation rule' })
  async update(@Param('id') id: string, @Body() data: any) {
    return this.automationService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete automation rule' })
  async remove(@Param('id') id: string) {
    await this.automationService.remove(id);
  }
}
