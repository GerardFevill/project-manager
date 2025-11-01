import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExecutiveDashboard } from './entities/ExecutiveDashboard.entity';
import { CreateExecutiveDashboardDto } from './dto/create-executive-dashboards.dto';
import { UpdateExecutiveDashboardDto } from './dto/update-executive-dashboards.dto';

@Injectable()
export class ExecutiveDashboardsService {
  constructor(@InjectRepository(ExecutiveDashboard) private readonly repository: Repository<ExecutiveDashboard>) {}

  async create(dto: CreateExecutiveDashboardDto): Promise<ExecutiveDashboard> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ExecutiveDashboard[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ExecutiveDashboard> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ExecutiveDashboard ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateExecutiveDashboardDto): Promise<ExecutiveDashboard> {
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
