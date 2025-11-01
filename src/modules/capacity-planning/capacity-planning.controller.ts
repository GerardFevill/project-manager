import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CapacityPlanningService } from './capacity-planning.service';
import { CreateCapacityPlanDto } from './dto/create-capacity-planning.dto';
import { UpdateCapacityPlanDto } from './dto/update-capacity-planning.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('capacity-planning')
@Controller('capacity-planning')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CapacityPlanningController {
  constructor(private readonly service: CapacityPlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Create capacity-planning' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateCapacityPlanDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all capacity-planning' })
  @ApiResponse({ status: 200 })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get capacity-planning by ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update capacity-planning' })
  @ApiResponse({ status: 200 })
  update(@Param('id') id: string, @Body() dto: UpdateCapacityPlanDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete capacity-planning' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
  }
}
