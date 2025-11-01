import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreenScheme } from './entities/ScreenScheme.entity';
import { CreateScreenSchemeDto } from './dto/create-screen-schemes.dto';
import { UpdateScreenSchemeDto } from './dto/update-screen-schemes.dto';

@Injectable()
export class ScreenSchemesService {
  constructor(@InjectRepository(ScreenScheme) private readonly repository: Repository<ScreenScheme>) {}

  async create(dto: CreateScreenSchemeDto): Promise<ScreenScheme> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ScreenScheme[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ScreenScheme> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ScreenScheme ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateScreenSchemeDto): Promise<ScreenScheme> {
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
