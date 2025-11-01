import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapacityPlan } from './entities/capacity-plan.entity';
import { CreateCapacityPlanDto } from './dto/create-capacity-planning.dto';
import { UpdateCapacityPlanDto } from './dto/update-capacity-planning.dto';

@Injectable()
export class CapacityPlanningService {
  constructor(
    @InjectRepository(CapacityPlan)
    private readonly repository: Repository<CapacityPlan>,
  ) {}

  async create(dto: CreateCapacityPlanDto): Promise<CapacityPlan> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CapacityPlan[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<CapacityPlan> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CapacityPlan ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCapacityPlanDto): Promise<CapacityPlan> {
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
