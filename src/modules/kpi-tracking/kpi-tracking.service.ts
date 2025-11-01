import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KpiMetric } from './entities/KpiMetric.entity';
import { CreateKpiMetricDto } from './dto/create-kpi-tracking.dto';
import { UpdateKpiMetricDto } from './dto/update-kpi-tracking.dto';

@Injectable()
export class KpiTrackingService {
  constructor(@InjectRepository(KpiMetric) private readonly repository: Repository<KpiMetric>) {}

  async create(dto: CreateKpiMetricDto): Promise<KpiMetric> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<KpiMetric[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<KpiMetric> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`KpiMetric ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateKpiMetricDto): Promise<KpiMetric> {
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
