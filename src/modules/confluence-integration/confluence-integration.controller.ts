import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfluenceIntegrationService } from './confluence-integration.service';
import { CreateConfluencePageDto } from './dto/create-confluence-integration.dto';
import { UpdateConfluencePageDto } from './dto/update-confluence-integration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('confluence-integration')
@Controller('confluence-integration')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConfluenceIntegrationController {
  constructor(private readonly service: ConfluenceIntegrationService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateConfluencePageDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateConfluencePageDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
