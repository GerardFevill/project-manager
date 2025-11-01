import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceAppsService } from './marketplace-apps.service';
import { CreateMarketplaceAppDto } from './dto/create-marketplace-apps.dto';
import { UpdateMarketplaceAppDto } from './dto/update-marketplace-apps.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('marketplace-apps')
@Controller('marketplace-apps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceAppsController {
  constructor(private readonly service: MarketplaceAppsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateMarketplaceAppDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateMarketplaceAppDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
