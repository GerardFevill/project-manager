import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Project[]; total: number; page: number; lastPage: number }> {
    const [data, total] = await this.projectRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['lead'],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async findByKey(projectKey: string): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { projectKey },
      relations: ['lead'],
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    // Check if project key already exists
    const existingProject = await this.findByKey(createProjectDto.projectKey);
    if (existingProject) {
      throw new ConflictException(`Project with key ${createProjectDto.projectKey} already exists`);
    }

    const project = this.projectRepository.create({
      ...createProjectDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.projectRepository.save(project);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);

    Object.assign(project, updateProjectDto);
    project.updatedAt = new Date();

    return this.projectRepository.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }

  async archive(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isArchived = true;
    project.updatedAt = new Date();
    return this.projectRepository.save(project);
  }

  async unarchive(id: string): Promise<Project> {
    const project = await this.findOne(id);
    project.isArchived = false;
    project.updatedAt = new Date();
    return this.projectRepository.save(project);
  }
}

  // ========== PROJECT USERS & ROLES ==========

  async getProjectUsers(id: string): Promise<any> {
    const project = await this.findOne(id);
    // TODO: Get users from project_users table
    return { projectId: id, users: [] };
  }

  async getRoleActors(projectId: string, roleId: string): Promise<any> {
    await this.findOne(projectId);
    // TODO: Get actors from project_role_actors table
    return { projectId, roleId, actors: [] };
  }

  async addRoleActor(projectId: string, roleId: string, actorData: any): Promise<any> {
    await this.findOne(projectId);
    // TODO: Add to project_role_actors table
    return { projectId, roleId, actor: actorData };
  }

  async removeRoleActor(projectId: string, roleId: string, actorId: string): Promise<void> {
    await this.findOne(projectId);
    // TODO: Remove from project_role_actors table
  }

  // ========== PROJECT CONFIGURATION ==========

  async getIssueSecurityLevelScheme(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, scheme: null };
  }

  async getNotificationScheme(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, scheme: null };
  }

  async getPermissionScheme(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, scheme: null };
  }

  async getProjectFeatures(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, features: ['boards', 'sprints', 'reports'] };
  }

  async updateProjectFeatures(id: string, features: any): Promise<any> {
    const project = await this.findOne(id);
    // TODO: Store features in project_features table
    return { projectId: id, features };
  }

  // ========== PROJECT SEARCH & METADATA ==========

  async searchProjects(query: string): Promise<Project[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.name LIKE :query OR project.projectKey LIKE :query', { query: `%${query}%` })
      .take(20)
      .getMany();
  }

  async getProjectAvatar(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, avatarUrl: null };
  }

  async uploadProjectAvatar(id: string, avatarData: any): Promise<any> {
    const project = await this.findOne(id);
    // TODO: Store avatar URL in project
    return { projectId: id, avatarUrl: avatarData.url };
  }

  async getProjectHierarchy(id: string): Promise<any> {
    await this.findOne(id);
    return { projectId: id, hierarchy: [] };
  }

  async getProjectInsights(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Calculate project insights
    return {
      projectId: id,
      insights: {
        totalIssues: 0,
        openIssues: 0,
        closedIssues: 0,
        averageResolutionTime: 0,
      }
    };
  }

  async validateProject(id: string): Promise<any> {
    const project = await this.findOne(id);
    const errors = [];

    if (!project.name) errors.push('Project name is required');
    if (!project.projectKey) errors.push('Project key is required');

    return { projectId: id, valid: errors.length === 0, errors };
  }
}
