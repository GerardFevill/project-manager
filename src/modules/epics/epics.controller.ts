import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EpicsService } from './epics.service';
import { CreateEpicDto } from './dto/create-epics.dto';
import { UpdateEpicDto } from './dto/update-epics.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('epics')
@Controller('epics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EpicsController {
  constructor(private readonly service: EpicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create epics' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateEpicDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all epics' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get epics by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update epics' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateEpicDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete epics' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
