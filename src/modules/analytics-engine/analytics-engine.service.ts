import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsMetric } from './entities/AnalyticsMetric.entity';
import { CreateAnalyticsMetricDto } from './dto/create-analytics-engine.dto';
import { UpdateAnalyticsMetricDto } from './dto/update-analytics-engine.dto';

@Injectable()
export class AnalyticsEngineService {
  constructor(@InjectRepository(AnalyticsMetric) private readonly repository: Repository<AnalyticsMetric>) {}

  async create(dto: CreateAnalyticsMetricDto): Promise<AnalyticsMetric> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<AnalyticsMetric[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<AnalyticsMetric> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AnalyticsMetric ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateAnalyticsMetricDto): Promise<AnalyticsMetric> {
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
