import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentimentLog } from './entities/SentimentLog.entity';
import { CreateSentimentLogDto } from './dto/create-sentiment-analysis.dto';
import { UpdateSentimentLogDto } from './dto/update-sentiment-analysis.dto';

@Injectable()
export class SentimentAnalysisService {
  constructor(@InjectRepository(SentimentLog) private readonly repository: Repository<SentimentLog>) {}

  async create(dto: CreateSentimentLogDto): Promise<SentimentLog> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<SentimentLog[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<SentimentLog> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`SentimentLog ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateSentimentLogDto): Promise<SentimentLog> {
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
