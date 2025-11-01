import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowScheme } from './entities/WorkflowScheme.entity';
import { CreateWorkflowSchemeDto } from './dto/create-workflow-schemes.dto';
import { UpdateWorkflowSchemeDto } from './dto/update-workflow-schemes.dto';

@Injectable()
export class WorkflowSchemesService {
  constructor(@InjectRepository(WorkflowScheme) private readonly repository: Repository<WorkflowScheme>) {}

  async create(dto: CreateWorkflowSchemeDto): Promise<WorkflowScheme> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<WorkflowScheme[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<WorkflowScheme> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`WorkflowScheme ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateWorkflowSchemeDto): Promise<WorkflowScheme> {
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
