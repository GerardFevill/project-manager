import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Retrospective } from './entities/Retrospective.entity';
import { CreateRetrospectiveDto } from './dto/create-retrospectives.dto';
import { UpdateRetrospectiveDto } from './dto/update-retrospectives.dto';

@Injectable()
export class RetrospectivesService {
  constructor(@InjectRepository(Retrospective) private readonly repository: Repository<Retrospective>) {}

  async create(dto: CreateRetrospectiveDto): Promise<Retrospective> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Retrospective[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Retrospective> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Retrospective ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateRetrospectiveDto): Promise<Retrospective> {
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
