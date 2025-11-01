import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SmartNotificationsService } from './smart-notifications.service';
import { CreateSmartNotificationDto } from './dto/create-smart-notifications.dto';
import { UpdateSmartNotificationDto } from './dto/update-smart-notifications.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('smart-notifications')
@Controller('smart-notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SmartNotificationsController {
  constructor(private readonly service: SmartNotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateSmartNotificationDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateSmartNotificationDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
