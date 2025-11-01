import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePriorityDto, UpdatePriorityDto } from './dto/priority.dto';
import { CreateIssueTypeDto, UpdateIssueTypeDto } from './dto/issue-type.dto';
import { CreateResolutionDto, UpdateResolutionDto } from './dto/resolution.dto';
import { CreateStatusDto, UpdateStatusDto } from './dto/status.dto';
import { UpdateApplicationPropertyDto } from './dto/application-property.dto';

@ApiTags('system')
@Controller('system')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  // ========== SERVER INFO ==========

  @Get('serverInfo')
  @ApiOperation({ summary: 'Get server information' })
  @ApiResponse({ status: 200, description: 'Server information retrieved' })
  getServerInfo() {
    return this.systemService.getServerInfo();
  }

  @Get('configuration')
  @ApiOperation({ summary: 'Get system configuration' })
  @ApiResponse({ status: 200 })
  getConfiguration() {
    return this.systemService.getConfiguration();
  }

  @Get('configuration/timetracking')
  @ApiOperation({ summary: 'Get time tracking configuration' })
  @ApiResponse({ status: 200 })
  getTimeTrackingConfiguration() {
    return this.systemService.getTimeTrackingConfiguration();
  }

  @Put('configuration/timetracking')
  @ApiOperation({ summary: 'Update time tracking configuration' })
  @ApiResponse({ status: 200 })
  updateTimeTrackingConfiguration(@Body() config: any) {
    return this.systemService.updateTimeTrackingConfiguration(config);
  }

  @Get('configuration/timetracking/list')
  @ApiOperation({ summary: 'Get list of time tracking options' })
  @ApiResponse({ status: 200 })
  getTimeTrackingList() {
    return this.systemService.getTimeTrackingList();
  }

  // ========== APPLICATION PROPERTIES ==========

  @Get('application-properties')
  @ApiOperation({ summary: 'Get all application properties' })
  @ApiResponse({ status: 200 })
  getApplicationProperties(@Query('key') key?: string) {
    return this.systemService.getApplicationProperties(key);
  }

  @Get('application-properties/advanced-settings')
  @ApiOperation({ summary: 'Get advanced settings' })
  @ApiResponse({ status: 200 })
  getAdvancedSettings() {
    return this.systemService.getAdvancedSettings();
  }

  @Get('application-properties/:id')
  @ApiOperation({ summary: 'Get application property by ID' })
  @ApiResponse({ status: 200 })
  getApplicationProperty(@Param('id') id: string) {
    return this.systemService.getApplicationProperty(id);
  }

  @Put('application-properties/:id')
  @ApiOperation({ summary: 'Update application property' })
  @ApiResponse({ status: 200 })
  updateApplicationProperty(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationPropertyDto
  ) {
    return this.systemService.updateApplicationProperty(id, dto);
  }

  // ========== PRIORITIES ==========

  @Get('priority')
  @ApiOperation({ summary: 'Get all priorities' })
  @ApiResponse({ status: 200 })
  getPriorities() {
    return this.systemService.getPriorities();
  }

  @Post('priority')
  @ApiOperation({ summary: 'Create priority' })
  @ApiResponse({ status: 201 })
  createPriority(@Body() dto: CreatePriorityDto) {
    return this.systemService.createPriority(dto);
  }

  @Get('priority/:id')
  @ApiOperation({ summary: 'Get priority by ID' })
  @ApiResponse({ status: 200 })
  getPriority(@Param('id') id: string) {
    return this.systemService.getPriority(id);
  }

  @Put('priority/:id')
  @ApiOperation({ summary: 'Update priority' })
  @ApiResponse({ status: 200 })
  updatePriority(@Param('id') id: string, @Body() dto: UpdatePriorityDto) {
    return this.systemService.updatePriority(id, dto);
  }

  @Delete('priority/:id')
  @ApiOperation({ summary: 'Delete priority' })
  @ApiResponse({ status: 204 })
  deletePriority(@Param('id') id: string) {
    return this.systemService.deletePriority(id);
  }

  // ========== ISSUE TYPES ==========

  @Get('issuetype')
  @ApiOperation({ summary: 'Get all issue types' })
  @ApiResponse({ status: 200 })
  getIssueTypes() {
    return this.systemService.getIssueTypes();
  }

  @Post('issuetype')
  @ApiOperation({ summary: 'Create issue type' })
  @ApiResponse({ status: 201 })
  createIssueType(@Body() dto: CreateIssueTypeDto) {
    return this.systemService.createIssueType(dto);
  }

  @Get('issuetype/:id')
  @ApiOperation({ summary: 'Get issue type by ID' })
  @ApiResponse({ status: 200 })
  getIssueType(@Param('id') id: string) {
    return this.systemService.getIssueType(id);
  }

  @Put('issuetype/:id')
  @ApiOperation({ summary: 'Update issue type' })
  @ApiResponse({ status: 200 })
  updateIssueType(@Param('id') id: string, @Body() dto: UpdateIssueTypeDto) {
    return this.systemService.updateIssueType(id, dto);
  }

  @Delete('issuetype/:id')
  @ApiOperation({ summary: 'Delete issue type' })
  @ApiResponse({ status: 204 })
  deleteIssueType(@Param('id') id: string) {
    return this.systemService.deleteIssueType(id);
  }

  // ========== RESOLUTIONS ==========

  @Get('resolution')
  @ApiOperation({ summary: 'Get all resolutions' })
  @ApiResponse({ status: 200 })
  getResolutions() {
    return this.systemService.getResolutions();
  }

  @Post('resolution')
  @ApiOperation({ summary: 'Create resolution' })
  @ApiResponse({ status: 201 })
  createResolution(@Body() dto: CreateResolutionDto) {
    return this.systemService.createResolution(dto);
  }

  @Get('resolution/:id')
  @ApiOperation({ summary: 'Get resolution by ID' })
  @ApiResponse({ status: 200 })
  getResolution(@Param('id') id: string) {
    return this.systemService.getResolution(id);
  }

  @Put('resolution/:id')
  @ApiOperation({ summary: 'Update resolution' })
  @ApiResponse({ status: 200 })
  updateResolution(@Param('id') id: string, @Body() dto: UpdateResolutionDto) {
    return this.systemService.updateResolution(id, dto);
  }

  @Delete('resolution/:id')
  @ApiOperation({ summary: 'Delete resolution' })
  @ApiResponse({ status: 204 })
  deleteResolution(@Param('id') id: string) {
    return this.systemService.deleteResolution(id);
  }

  // ========== STATUSES ==========

  @Get('status')
  @ApiOperation({ summary: 'Get all statuses' })
  @ApiResponse({ status: 200 })
  getStatuses() {
    return this.systemService.getStatuses();
  }

  @Post('status')
  @ApiOperation({ summary: 'Create status' })
  @ApiResponse({ status: 201 })
  createStatus(@Body() dto: CreateStatusDto) {
    return this.systemService.createStatus(dto);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Get status by ID' })
  @ApiResponse({ status: 200 })
  getStatus(@Param('id') id: string) {
    return this.systemService.getStatus(id);
  }

  @Put('status/:id')
  @ApiOperation({ summary: 'Update status' })
  @ApiResponse({ status: 200 })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.systemService.updateStatus(id, dto);
  }

  @Delete('status/:id')
  @ApiOperation({ summary: 'Delete status' })
  @ApiResponse({ status: 204 })
  deleteStatus(@Param('id') id: string) {
    return this.systemService.deleteStatus(id);
  }

  // ========== SETTINGS ==========

  @Get('settings/columns')
  @ApiOperation({ summary: 'Get column settings' })
  @ApiResponse({ status: 200 })
  getColumnSettings() {
    return this.systemService.getColumnSettings();
  }

  @Put('settings/columns')
  @ApiOperation({ summary: 'Update column settings' })
  @ApiResponse({ status: 200 })
  updateColumnSettings(@Body() settings: any) {
    return this.systemService.updateColumnSettings(settings);
  }
}
