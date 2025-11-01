import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BurnChartsService } from './burn-charts.service';
import { CreateBurnDataDto } from './dto/create-burn-charts.dto';
import { UpdateBurnDataDto } from './dto/update-burn-charts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('burn-charts')
@Controller('burn-charts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BurnChartsController {
  constructor(private readonly service: BurnChartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateBurnDataDto) { return this.service.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Get all' })
  @ApiResponse({ status: 200 })
  findAll() { return this.service.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Get by ID' })
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update' })
  update(@Param('id') id: string, @Body() dto: UpdateBurnDataDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete' })
  async remove(@Param('id') id: string) { await this.service.remove(id); }
}
