import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoryMap } from './entities/StoryMap.entity';
import { CreateStoryMapDto } from './dto/create-story-mapping.dto';
import { UpdateStoryMapDto } from './dto/update-story-mapping.dto';

@Injectable()
export class StoryMappingService {
  constructor(@InjectRepository(StoryMap) private readonly repository: Repository<StoryMap>) {}

  async create(dto: CreateStoryMapDto): Promise<StoryMap> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<StoryMap[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<StoryMap> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`StoryMap ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateStoryMapDto): Promise<StoryMap> {
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
