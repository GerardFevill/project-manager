import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentRule } from './entities/AssignmentRule.entity';
import { CreateAssignmentRuleDto } from './dto/create-auto-assignment.dto';
import { UpdateAssignmentRuleDto } from './dto/update-auto-assignment.dto';

@Injectable()
export class AutoAssignmentService {
  constructor(@InjectRepository(AssignmentRule) private readonly repository: Repository<AssignmentRule>) {}

  async create(dto: CreateAssignmentRuleDto): Promise<AssignmentRule> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<AssignmentRule[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<AssignmentRule> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AssignmentRule ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateAssignmentRuleDto): Promise<AssignmentRule> {
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
