import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from './entities/Translation.entity';
import { CreateTranslationDto } from './dto/create-localization.dto';
import { UpdateTranslationDto } from './dto/update-localization.dto';

@Injectable()
export class LocalizationService {
  constructor(@InjectRepository(Translation) private readonly repository: Repository<Translation>) {}

  async create(dto: CreateTranslationDto): Promise<Translation> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Translation[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Translation> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Translation ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateTranslationDto): Promise<Translation> {
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
