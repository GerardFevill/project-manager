import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignProjectRoleDto } from './dto/assign-project-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Global Roles
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Returns list of roles' })
  async findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Returns role details' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findRole(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role successfully created' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({ status: 200, description: 'Role successfully updated' })
  @ApiResponse({ status: 400, description: 'Cannot update system roles' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete role by ID' })
  @ApiResponse({ status: 204, description: 'Role successfully deleted' })
  @ApiResponse({ status: 400, description: 'Cannot delete system roles' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id') id: string) {
    return this.rolesService.removeRole(id);
  }

  // Project Roles
  @Post('project')
  @ApiOperation({ summary: 'Assign role to user in project' })
  @ApiResponse({ status: 201, description: 'Role successfully assigned' })
  async assignProjectRole(@Body() assignProjectRoleDto: AssignProjectRoleDto) {
    return this.rolesService.assignProjectRole(assignProjectRoleDto);
  }

  @Delete('project/:projectId/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove user role from project' })
  @ApiResponse({ status: 204, description: 'Role successfully removed' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  async removeProjectRole(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.rolesService.removeProjectRole(projectId, userId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all role assignments for a project' })
  @ApiResponse({ status: 200, description: 'Returns project role assignments' })
  async getProjectRoles(@Param('projectId') projectId: string) {
    return this.rolesService.getProjectRoles(projectId);
  }

  @Get('user/me/projects')
  @ApiOperation({ summary: 'Get current user projects and roles' })
  @ApiResponse({ status: 200, description: 'Returns user projects with roles' })
  async getMyProjects(@CurrentUser() user: any) {
    return this.rolesService.getUserProjects(user.userId);
  }

  @Get('project/:projectId/user/:userId')
  @ApiOperation({ summary: 'Get user role in a project' })
  @ApiResponse({ status: 200, description: 'Returns user role in project' })
  async getUserProjectRole(@Param('projectId') projectId: string, @Param('userId') userId: string) {
    return this.rolesService.getUserProjectRole(projectId, userId);
  }
}
