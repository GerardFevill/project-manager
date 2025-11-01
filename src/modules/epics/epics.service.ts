import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from './entities/Epic.entity';
import { CreateEpicDto } from './dto/create-epics.dto';
import { UpdateEpicDto } from './dto/update-epics.dto';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic)
    private readonly repository: Repository<Epic>,
  ) {}

  async create(dto: CreateEpicDto): Promise<Epic> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Epic[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Epic> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Epic ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateEpicDto): Promise<Epic> {
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
