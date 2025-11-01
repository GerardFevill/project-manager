import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataRetention } from './entities/DataRetention.entity';
import { CreateDataRetentionDto } from './dto/create-data-retention.dto';
import { UpdateDataRetentionDto } from './dto/update-data-retention.dto';

@Injectable()
export class DataRetentionService {
  constructor(@InjectRepository(DataRetention) private readonly repository: Repository<DataRetention>) {}

  async create(dto: CreateDataRetentionDto): Promise<DataRetention> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<DataRetention[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<DataRetention> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`DataRetention ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateDataRetentionDto): Promise<DataRetention> {
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
