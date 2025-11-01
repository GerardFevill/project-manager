import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LabelsService } from './labels.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('labels')
@Controller('labels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all labels' })
  @ApiResponse({ status: 200, description: 'Returns list of labels' })
  async findAll() {
    return this.labelsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search labels by name or description' })
  @ApiQuery({ name: 'q', type: String, example: 'bug' })
  @ApiResponse({ status: 200, description: 'Returns matching labels' })
  async search(@Query('q') query: string) {
    return this.labelsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get label by ID' })
  @ApiResponse({ status: 200, description: 'Returns label details' })
  @ApiResponse({ status: 404, description: 'Label not found' })
  async findOne(@Param('id') id: string) {
    return this.labelsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new label' })
  @ApiResponse({ status: 201, description: 'Label successfully created' })
  @ApiResponse({ status: 409, description: 'Label name already exists' })
  async create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.create(createLabelDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update label by ID' })
  @ApiResponse({ status: 200, description: 'Label successfully updated' })
  @ApiResponse({ status: 404, description: 'Label not found' })
  @ApiResponse({ status: 409, description: 'Label name already exists' })
  async update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelsService.update(id, updateLabelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete label by ID' })
  @ApiResponse({ status: 204, description: 'Label successfully deleted' })
  @ApiResponse({ status: 404, description: 'Label not found' })
  async remove(@Param('id') id: string) {
    return this.labelsService.remove(id);
  }
}
