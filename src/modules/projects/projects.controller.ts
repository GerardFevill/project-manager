import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Returns list of projects' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.projectsService.findAll(Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Returns project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get project by key' })
  @ApiResponse({ status: 200, description: 'Returns project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findByKey(@Param('key') key: string) {
    return this.projectsService.findByKey(key);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project successfully created' })
  @ApiResponse({ status: 409, description: 'Project key already exists' })
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({ status: 200, description: 'Project successfully updated' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({ status: 204, description: 'Project successfully deleted' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive project' })
  @ApiResponse({ status: 200, description: 'Project successfully archived' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async archive(@Param('id') id: string) {
    return this.projectsService.archive(id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive project' })
  @ApiResponse({ status: 200, description: 'Project successfully unarchived' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async unarchive(@Param('id') id: string) {
    return this.projectsService.unarchive(id);
  }

  // ========== PROJECT USERS & ROLES ==========

  @Get(':id/users')
  @ApiOperation({ summary: 'Get all users in project' })
  getProjectUsers(@Param('id') id: string) {
    return { projectId: id, users: [] };
  }

  @Get(':id/roles/:roleId/actors')
  @ApiOperation({ summary: 'Get actors for project role' })
  getRoleActors(@Param('id') id: string, @Param('roleId') roleId: string) {
    return { projectId: id, roleId, actors: [] };
  }

  @Post(':id/roles/:roleId/actors')
  @ApiOperation({ summary: 'Add actor to project role' })
  addRoleActor(@Param('id') id: string, @Param('roleId') roleId: string, @Body() dto: any) {
    return { projectId: id, roleId, actor: dto };
  }

  @Delete(':id/roles/:roleId/actors/:actorId')
  @ApiOperation({ summary: 'Remove actor from project role' })
  removeRoleActor(@Param('id') id: string, @Param('roleId') roleId: string, @Param('actorId') actorId: string) {
    return { removed: true };
  }

  // ========== PROJECT CONFIGURATION ==========

  @Get(':id/issuesecuritylevelscheme')
  @ApiOperation({ summary: 'Get issue security level scheme for project' })
  getIssueSecurityLevelScheme(@Param('id') id: string) {
    return { projectId: id, scheme: null };
  }

  @Get(':id/notificationscheme')
  @ApiOperation({ summary: 'Get notification scheme for project' })
  getNotificationScheme(@Param('id') id: string) {
    return { projectId: id, scheme: null };
  }

  @Get(':id/permissionscheme')
  @ApiOperation({ summary: 'Get permission scheme for project' })
  getPermissionScheme(@Param('id') id: string) {
    return { projectId: id, scheme: null };
  }

  @Get(':id/features')
  @ApiOperation({ summary: 'Get project features' })
  getProjectFeatures(@Param('id') id: string) {
    return { projectId: id, features: [] };
  }

  @Put(':id/features')
  @ApiOperation({ summary: 'Update project features' })
  updateProjectFeatures(@Param('id') id: string, @Body() dto: any) {
    return { projectId: id, features: dto };
  }

  // ========== PROJECT SEARCH & METADATA ==========

  @Get('search')
  @ApiOperation({ summary: 'Search projects' })
  searchProjects(@Query('query') query: string) {
    return { query, results: [] };
  }

  @Get(':id/avatar')
  @ApiOperation({ summary: 'Get project avatar' })
  getProjectAvatar(@Param('id') id: string) {
    return { projectId: id, avatarUrl: null };
  }

  @Post(':id/avatar')
  @ApiOperation({ summary: 'Upload project avatar' })
  uploadProjectAvatar(@Param('id') id: string, @Body() dto: any) {
    return { projectId: id, avatarUrl: dto.url };
  }

  @Get(':id/hierarchy')
  @ApiOperation({ summary: 'Get project hierarchy' })
  getProjectHierarchy(@Param('id') id: string) {
    return { projectId: id, hierarchy: [] };
  }

  @Get(':id/insights')
  @ApiOperation({ summary: 'Get project insights' })
  getProjectInsights(@Param('id') id: string) {
    return { projectId: id, insights: {} };
  }

  @Get(':id/validate')
  @ApiOperation({ summary: 'Validate project configuration' })
  validateProject(@Param('id') id: string) {
    return { projectId: id, valid: true, errors: [] };
  }
}
