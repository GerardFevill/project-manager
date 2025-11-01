import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { ProjectRole } from './entities/project-role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AssignProjectRoleDto } from './dto/assign-project-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(ProjectRole)
    private readonly projectRoleRepository: Repository<ProjectRole>,
  ) {}

  // Global Roles Management
  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findRole(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const existing = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existing) {
      throw new ConflictException(`Role with name ${createRoleDto.name} already exists`);
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.roleRepository.save(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRole(id);

    if (role.isSystemRole) {
      throw new BadRequestException('Cannot update system roles');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existing) {
        throw new ConflictException(`Role with name ${updateRoleDto.name} already exists`);
      }
    }

    Object.assign(role, updateRoleDto);
    role.updatedAt = new Date();

    return this.roleRepository.save(role);
  }

  async removeRole(id: string): Promise<void> {
    const role = await this.findRole(id);

    if (role.isSystemRole) {
      throw new BadRequestException('Cannot delete system roles');
    }

    await this.roleRepository.remove(role);
  }

  // Project Roles Management
  async assignProjectRole(assignProjectRoleDto: AssignProjectRoleDto): Promise<ProjectRole> {
    const { projectId, userId, roleId } = assignProjectRoleDto;

    // Check if assignment already exists
    const existing = await this.projectRoleRepository.findOne({
      where: { projectId, userId },
    });

    if (existing) {
      // Update existing role
      existing.roleId = roleId;
      return this.projectRoleRepository.save(existing);
    }

    const projectRole = this.projectRoleRepository.create({
      projectId,
      userId,
      roleId,
      assignedAt: new Date(),
    });

    return this.projectRoleRepository.save(projectRole);
  }

  async removeProjectRole(projectId: string, userId: string): Promise<void> {
    const projectRole = await this.projectRoleRepository.findOne({
      where: { projectId, userId },
    });

    if (!projectRole) {
      throw new NotFoundException('Project role assignment not found');
    }

    await this.projectRoleRepository.remove(projectRole);
  }

  async getProjectRoles(projectId: string): Promise<ProjectRole[]> {
    return this.projectRoleRepository.find({
      where: { projectId },
      relations: ['user', 'role'],
      order: { assignedAt: 'DESC' },
    });
  }

  async getUserProjectRole(projectId: string, userId: string): Promise<ProjectRole | null> {
    return this.projectRoleRepository.findOne({
      where: { projectId, userId },
      relations: ['role'],
    });
  }

  async getUserProjects(userId: string): Promise<ProjectRole[]> {
    return this.projectRoleRepository.find({
      where: { userId },
      relations: ['project', 'role'],
    });
  }

  async hasPermission(userId: string, projectId: string, permission: string): Promise<boolean> {
    const projectRole = await this.getUserProjectRole(projectId, userId);

    if (!projectRole || !projectRole.role) {
      return false;
    }

    return projectRole.role.permissions?.includes(permission) || false;
  }

  // Initialize system roles (call this on app startup)
  async initializeSystemRoles(): Promise<void> {
    const systemRoles = [
      {
        name: 'Administrator',
        description: 'Full system access',
        isSystemRole: true,
        permissions: ['*'], // All permissions
      },
      {
        name: 'Project Manager',
        description: 'Manage projects and team members',
        isSystemRole: true,
        permissions: ['project.*', 'issue.*', 'user.view'],
      },
      {
        name: 'Developer',
        description: 'Create and manage issues',
        isSystemRole: true,
        permissions: ['issue.*', 'comment.*', 'attachment.*'],
      },
      {
        name: 'Viewer',
        description: 'View-only access',
        isSystemRole: true,
        permissions: ['*.view'],
      },
    ];

    for (const roleData of systemRoles) {
      const existing = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existing) {
        await this.roleRepository.save(this.roleRepository.create(roleData));
      }
    }
  }
}
