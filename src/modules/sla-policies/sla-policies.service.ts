import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SlaPolicy } from './entities/SlaPolicy.entity';
import { CreateSlaPolicyDto } from './dto/create-sla-policies.dto';
import { UpdateSlaPolicyDto } from './dto/update-sla-policies.dto';

@Injectable()
export class SlaPoliciesService {
  constructor(@InjectRepository(SlaPolicy) private readonly repository: Repository<SlaPolicy>) {}

  async create(dto: CreateSlaPolicyDto): Promise<SlaPolicy> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<SlaPolicy[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<SlaPolicy> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`SlaPolicy ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateSlaPolicyDto): Promise<SlaPolicy> {
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
