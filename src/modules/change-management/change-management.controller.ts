import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChangeManagementService } from './change-management.service';
import { CreateChangeRequestDto } from './dto/create-change-management.dto';
import { UpdateChangeRequestDto } from './dto/update-change-management.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('change-management')
@Controller('change-management')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChangeManagementController {
  constructor(private readonly service: ChangeManagementService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateChangeRequestDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateChangeRequestDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
