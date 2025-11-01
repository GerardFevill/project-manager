import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dependency } from './entities/dependency.entity';
import { CreateDependencyDto } from './dto/create-dependencies.dto';
import { UpdateDependencyDto } from './dto/update-dependencies.dto';

@Injectable()
export class DependenciesService {
  constructor(
    @InjectRepository(Dependency)
    private readonly repository: Repository<Dependency>,
  ) {}

  async create(dto: CreateDependencyDto): Promise<Dependency> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Dependency[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Dependency> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Dependency ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateDependencyDto): Promise<Dependency> {
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
