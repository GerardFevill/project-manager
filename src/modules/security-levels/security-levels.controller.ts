import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityLevelsService } from './security-levels.service';
import { CreateSecurityLevelDto } from './dto/create-security-levels.dto';
import { UpdateSecurityLevelDto } from './dto/update-security-levels.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('security-levels')
@Controller('security-levels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SecurityLevelsController {
  constructor(private readonly service: SecurityLevelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateSecurityLevelDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateSecurityLevelDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
