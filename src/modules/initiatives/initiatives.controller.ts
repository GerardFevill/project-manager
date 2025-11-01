import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiatives.dto';
import { UpdateInitiativeDto } from './dto/update-initiatives.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('initiatives')
@Controller('initiatives')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InitiativesController {
  constructor(private readonly service: InitiativesService) {}

  @Post()
  @ApiOperation({ summary: 'Create initiatives' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateInitiativeDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all initiatives' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get initiatives by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update initiatives' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateInitiativeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete initiatives' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
