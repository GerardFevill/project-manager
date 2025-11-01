import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Initiative } from './entities/Initiative.entity';
import { CreateInitiativeDto } from './dto/create-initiatives.dto';
import { UpdateInitiativeDto } from './dto/update-initiatives.dto';

@Injectable()
export class InitiativesService {
  constructor(
    @InjectRepository(Initiative)
    private readonly repository: Repository<Initiative>,
  ) {}

  async create(dto: CreateInitiativeDto): Promise<Initiative> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Initiative[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Initiative> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Initiative ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateInitiativeDto): Promise<Initiative> {
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
