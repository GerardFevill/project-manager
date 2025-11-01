import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CumulativeFlow } from './entities/CumulativeFlow.entity';
import { CreateCumulativeFlowDto } from './dto/create-cumulative-flow.dto';
import { UpdateCumulativeFlowDto } from './dto/update-cumulative-flow.dto';

@Injectable()
export class CumulativeFlowService {
  constructor(@InjectRepository(CumulativeFlow) private readonly repository: Repository<CumulativeFlow>) {}

  async create(dto: CreateCumulativeFlowDto): Promise<CumulativeFlow> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CumulativeFlow[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CumulativeFlow> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CumulativeFlow ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCumulativeFlowDto): Promise<CumulativeFlow> {
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
