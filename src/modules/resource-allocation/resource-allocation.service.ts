import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceAllocation } from './entities/ResourceAllocation.entity';
import { CreateResourceAllocationDto } from './dto/create-resource-allocation.dto';
import { UpdateResourceAllocationDto } from './dto/update-resource-allocation.dto';

@Injectable()
export class ResourceAllocationService {
  constructor(
    @InjectRepository(ResourceAllocation)
    private readonly repository: Repository<ResourceAllocation>,
  ) {}

  async create(dto: CreateResourceAllocationDto): Promise<ResourceAllocation> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ResourceAllocation[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<ResourceAllocation> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ResourceAllocation ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateResourceAllocationDto): Promise<ResourceAllocation> {
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
