import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MigrationToolsService } from './migration-tools.service';
import { CreateMigrationDto } from './dto/create-migration-tools.dto';
import { UpdateMigrationDto } from './dto/update-migration-tools.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('migration-tools')
@Controller('migration-tools')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MigrationToolsController {
  constructor(private readonly service: MigrationToolsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateMigrationDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateMigrationDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
