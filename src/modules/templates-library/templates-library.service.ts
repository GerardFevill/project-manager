import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTemplate } from './entities/ProjectTemplate.entity';
import { CreateProjectTemplateDto } from './dto/create-templates-library.dto';
import { UpdateProjectTemplateDto } from './dto/update-templates-library.dto';

@Injectable()
export class TemplatesLibraryService {
  constructor(@InjectRepository(ProjectTemplate) private readonly repository: Repository<ProjectTemplate>) {}

  async create(dto: CreateProjectTemplateDto): Promise<ProjectTemplate> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ProjectTemplate[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ProjectTemplate> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ProjectTemplate ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateProjectTemplateDto): Promise<ProjectTemplate> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    entity.updatedAt = new Date();
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }
}
