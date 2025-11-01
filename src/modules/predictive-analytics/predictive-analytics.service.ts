import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './entities/Prediction.entity';
import { CreatePredictionDto } from './dto/create-predictive-analytics.dto';
import { UpdatePredictionDto } from './dto/update-predictive-analytics.dto';

@Injectable()
export class PredictiveAnalyticsService {
  constructor(@InjectRepository(Prediction) private readonly repository: Repository<Prediction>) {}

  async create(dto: CreatePredictionDto): Promise<Prediction> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Prediction[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Prediction> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Prediction ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdatePredictionDto): Promise<Prediction> {
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
