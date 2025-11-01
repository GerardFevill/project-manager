import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VersionsService } from './versions.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { UpdateVersionDto } from './dto/update-version.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('versions')
@Controller('versions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VersionsController {
  constructor(private readonly versionsService: VersionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all versions' })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns list of versions' })
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('includeArchived') includeArchived?: boolean,
  ) {
    return this.versionsService.findAll(projectId, includeArchived);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all versions for a project' })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns list of versions' })
  async findByProject(
    @Param('projectId') projectId: string,
    @Query('includeArchived') includeArchived?: boolean,
  ) {
    return this.versionsService.findByProject(projectId, includeArchived);
  }

  @Get('project/:projectId/unreleased')
  @ApiOperation({ summary: 'Get unreleased versions for a project' })
  @ApiResponse({ status: 200, description: 'Returns unreleased versions' })
  async getUnreleased(@Param('projectId') projectId: string) {
    return this.versionsService.getUnreleased(projectId);
  }

  @Get('project/:projectId/released')
  @ApiOperation({ summary: 'Get released versions for a project' })
  @ApiResponse({ status: 200, description: 'Returns released versions' })
  async getReleased(@Param('projectId') projectId: string) {
    return this.versionsService.getReleased(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get version by ID' })
  @ApiResponse({ status: 200, description: 'Returns version details' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async findOne(@Param('id') id: string) {
    return this.versionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new version' })
  @ApiResponse({ status: 201, description: 'Version successfully created' })
  @ApiResponse({ status: 409, description: 'Version name already exists' })
  async create(@Body() createVersionDto: CreateVersionDto) {
    return this.versionsService.create(createVersionDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update version by ID' })
  @ApiResponse({ status: 200, description: 'Version successfully updated' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async update(@Param('id') id: string, @Body() updateVersionDto: UpdateVersionDto) {
    return this.versionsService.update(id, updateVersionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete version by ID' })
  @ApiResponse({ status: 204, description: 'Version successfully deleted' })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async remove(@Param('id') id: string) {
    return this.versionsService.remove(id);
  }

  @Patch(':id/release')
  @ApiOperation({ summary: 'Mark version as released' })
  @ApiResponse({ status: 200, description: 'Version successfully released' })
  async release(@Param('id') id: string) {
    return this.versionsService.release(id);
  }

  @Patch(':id/unrelease')
  @ApiOperation({ summary: 'Unrelease version' })
  @ApiResponse({ status: 200, description: 'Version successfully unreleased' })
  async unrelease(@Param('id') id: string) {
    return this.versionsService.unrelease(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive version' })
  @ApiResponse({ status: 200, description: 'Version successfully archived' })
  async archive(@Param('id') id: string) {
    return this.versionsService.archive(id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive version' })
  @ApiResponse({ status: 200, description: 'Version successfully unarchived' })
  async unarchive(@Param('id') id: string) {
    return this.versionsService.unarchive(id);
  }
}
