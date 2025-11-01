import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ScreenSchemesService } from './screen-schemes.service';
import { CreateScreenSchemeDto } from './dto/create-screen-schemes.dto';
import { UpdateScreenSchemeDto } from './dto/update-screen-schemes.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('screen-schemes')
@Controller('screen-schemes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScreenSchemesController {
  constructor(private readonly service: ScreenSchemesService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateScreenSchemeDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateScreenSchemeDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
