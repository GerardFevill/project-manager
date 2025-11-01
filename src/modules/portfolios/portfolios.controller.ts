import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfoliosController {
  constructor(private readonly service: PortfoliosService) {}

  @Post()
  create(@Body() data: any) { return this.service.create(data); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.service.update(id, data); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
