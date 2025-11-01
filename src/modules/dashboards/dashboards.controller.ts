import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('dashboards')
@Controller('dashboards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  // Dashboards
  @Post()
  @ApiOperation({ summary: 'Create a dashboard' })
  @ApiResponse({ status: 201, description: 'Dashboard successfully created' })
  async create(@Request() req, @Body() createDashboardDto: CreateDashboardDto) {
    return this.dashboardsService.create(createDashboardDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accessible dashboards' })
  @ApiResponse({ status: 200, description: 'Returns list of dashboards' })
  async findAll(@Request() req) {
    return this.dashboardsService.findAll(req.user.userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get favorite dashboards' })
  @ApiResponse({ status: 200, description: 'Returns favorite dashboards' })
  async findFavorites(@Request() req) {
    return this.dashboardsService.findFavorites(req.user.userId);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default dashboard' })
  @ApiResponse({ status: 200, description: 'Returns default dashboard' })
  @ApiResponse({ status: 404, description: 'No default dashboard set' })
  async findDefault(@Request() req) {
    return this.dashboardsService.findDefault(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dashboard by ID' })
  @ApiResponse({ status: 200, description: 'Returns dashboard details with widgets' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.dashboardsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dashboard' })
  @ApiResponse({ status: 200, description: 'Dashboard successfully updated' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 403, description: 'Only owner can update' })
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDashboardDto: UpdateDashboardDto,
  ) {
    return this.dashboardsService.update(id, updateDashboardDto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete dashboard' })
  @ApiResponse({ status: 204, description: 'Dashboard successfully deleted' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 403, description: 'Only owner can delete' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.dashboardsService.remove(id, req.user.userId);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone dashboard' })
  @ApiResponse({ status: 201, description: 'Dashboard successfully cloned' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  async clone(@Request() req, @Param('id') id: string, @Body() body: { name: string }) {
    return this.dashboardsService.clone(id, req.user.userId, body.name);
  }

  // Widgets
  @Post(':id/widgets')
  @ApiOperation({ summary: 'Add widget to dashboard' })
  @ApiResponse({ status: 201, description: 'Widget successfully added' })
  @ApiResponse({ status: 404, description: 'Dashboard not found' })
  @ApiResponse({ status: 403, description: 'Only owner can add widgets' })
  async addWidget(
    @Request() req,
    @Param('id') dashboardId: string,
    @Body() createWidgetDto: CreateWidgetDto,
  ) {
    return this.dashboardsService.addWidget(dashboardId, createWidgetDto, req.user.userId);
  }

  @Put('widgets/:widgetId')
  @ApiOperation({ summary: 'Update widget' })
  @ApiResponse({ status: 200, description: 'Widget successfully updated' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  @ApiResponse({ status: 403, description: 'Only owner can update widgets' })
  async updateWidget(
    @Request() req,
    @Param('widgetId') widgetId: string,
    @Body() updateWidgetDto: UpdateWidgetDto,
  ) {
    return this.dashboardsService.updateWidget(widgetId, updateWidgetDto, req.user.userId);
  }

  @Delete('widgets/:widgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove widget' })
  @ApiResponse({ status: 204, description: 'Widget successfully removed' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  @ApiResponse({ status: 403, description: 'Only owner can remove widgets' })
  async removeWidget(@Request() req, @Param('widgetId') widgetId: string) {
    await this.dashboardsService.removeWidget(widgetId, req.user.userId);
  }

  @Get('widgets/:widgetId/data')
  @ApiOperation({ summary: 'Get widget data' })
  @ApiResponse({ status: 200, description: 'Returns widget data' })
  @ApiResponse({ status: 404, description: 'Widget not found' })
  async getWidgetData(@Request() req, @Param('widgetId') widgetId: string) {
    return this.dashboardsService.getWidgetData(widgetId, req.user.userId);
  }
}
