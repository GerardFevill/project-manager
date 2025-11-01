import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VelocityTrackingService } from './velocity-tracking.service';
import { CreateVelocityDto } from './dto/create-velocity-tracking.dto';
import { UpdateVelocityDto } from './dto/update-velocity-tracking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('velocity-tracking')
@Controller('velocity-tracking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VelocityTrackingController {
  constructor(private readonly service: VelocityTrackingService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateVelocityDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateVelocityDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
