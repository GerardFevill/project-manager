import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { CreateRoadmapDto } from './dto/create-roadmaps.dto';
import { UpdateRoadmapDto } from './dto/update-roadmaps.dto';

@Injectable()
export class RoadmapsService {
  constructor(
    @InjectRepository(Roadmap)
    private readonly repository: Repository<Roadmap>,
  ) {}

  async create(dto: CreateRoadmapDto): Promise<Roadmap> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Roadmap[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Roadmap> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Roadmap ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateRoadmapDto): Promise<Roadmap> {
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
