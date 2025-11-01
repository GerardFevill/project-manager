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
