import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OAuthAppsService } from './oauth-apps.service';
import { CreateOAuthAppDto } from './dto/create-oauth-apps.dto';
import { UpdateOAuthAppDto } from './dto/update-oauth-apps.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('oauth-apps')
@Controller('oauth-apps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OAuthAppsController {
  constructor(private readonly service: OAuthAppsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateOAuthAppDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateOAuthAppDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
