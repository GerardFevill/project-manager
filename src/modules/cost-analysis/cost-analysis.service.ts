import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostAnalysis } from './entities/CostAnalysis.entity';
import { CreateCostAnalysisDto } from './dto/create-cost-analysis.dto';
import { UpdateCostAnalysisDto } from './dto/update-cost-analysis.dto';

@Injectable()
export class CostAnalysisService {
  constructor(@InjectRepository(CostAnalysis) private readonly repository: Repository<CostAnalysis>) {}

  async create(dto: CreateCostAnalysisDto): Promise<CostAnalysis> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CostAnalysis[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CostAnalysis> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CostAnalysis ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCostAnalysisDto): Promise<CostAnalysis> {
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
