import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityStream } from './entities/ActivityStream.entity';
import { CreateActivityStreamDto } from './dto/create-activity-streams.dto';
import { UpdateActivityStreamDto } from './dto/update-activity-streams.dto';

@Injectable()
export class ActivityStreamsService {
  constructor(@InjectRepository(ActivityStream) private readonly repository: Repository<ActivityStream>) {}

  async create(dto: CreateActivityStreamDto): Promise<ActivityStream> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ActivityStream[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ActivityStream> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ActivityStream ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateActivityStreamDto): Promise<ActivityStream> {
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
