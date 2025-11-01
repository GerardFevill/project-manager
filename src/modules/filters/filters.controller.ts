import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FiltersService } from './filters.service';
import { CreateFilterDto } from './dto/create-filter.dto';
import { UpdateFilterDto } from './dto/update-filter.dto';
import { ExecuteFilterDto } from './dto/execute-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('filters')
@Controller('filters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new filter' })
  @ApiResponse({ status: 201, description: 'Filter successfully created' })
  async create(@Request() req, @Body() createFilterDto: CreateFilterDto) {
    return this.filtersService.create(createFilterDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible filters' })
  @ApiResponse({ status: 200, description: 'Returns list of filters' })
  async findAll(@Request() req) {
    return this.filtersService.findAll(req.user.userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get favorite filters' })
  @ApiResponse({ status: 200, description: 'Returns favorite filters' })
  async findFavorites(@Request() req) {
    return this.filtersService.findFavorites(req.user.userId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get filters for a project' })
  @ApiResponse({ status: 200, description: 'Returns project filters' })
  async findByProject(@Request() req, @Param('projectId') projectId: string) {
    return this.filtersService.findByProject(projectId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get filter by ID' })
  @ApiResponse({ status: 200, description: 'Returns filter details' })
  @ApiResponse({ status: 404, description: 'Filter not found' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.filtersService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update filter' })
  @ApiResponse({ status: 200, description: 'Filter successfully updated' })
  @ApiResponse({ status: 404, description: 'Filter not found' })
  @ApiResponse({ status: 403, description: 'Only owner can update' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFilterDto: UpdateFilterDto,
  ) {
    return this.filtersService.update(id, updateFilterDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete filter' })
  @ApiResponse({ status: 204, description: 'Filter successfully deleted' })
  @ApiResponse({ status: 404, description: 'Filter not found' })
  @ApiResponse({ status: 403, description: 'Only owner can delete' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.filtersService.remove(id, req.user.userId);
  }

  // JQL Execution
  @Post('execute')
  @ApiOperation({ summary: 'Execute JQL query' })
  @ApiResponse({ status: 200, description: 'Returns query results' })
  async executeJQL(@Body() executeFilterDto: ExecuteFilterDto) {
    return this.filtersService.executeJQL(executeFilterDto);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate JQL syntax' })
  @ApiResponse({ status: 200, description: 'Returns validation result' })
  async validateJQL(@Body() body: { jql: string }) {
    return this.filtersService.validateJQL(body.jql);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute saved filter' })
  @ApiResponse({ status: 200, description: 'Returns filter results' })
  async executeFilter(
    @Request() req,
    @Param('id') id: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ) {
    const filter = await this.filtersService.findOne(id, req.user.userId);
    await this.filtersService.incrementUsage(id);

    return this.filtersService.executeJQL({
      jql: filter.jql,
      offset: offset || 0,
      limit: limit || 50,
    });
  }
}
