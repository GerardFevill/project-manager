import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstimationTemplate } from './entities/EstimationTemplate.entity';
import { CreateEstimationTemplateDto } from './dto/create-estimation-templates.dto';
import { UpdateEstimationTemplateDto } from './dto/update-estimation-templates.dto';

@Injectable()
export class EstimationTemplatesService {
  constructor(@InjectRepository(EstimationTemplate) private readonly repository: Repository<EstimationTemplate>) {}

  async create(dto: CreateEstimationTemplateDto): Promise<EstimationTemplate> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<EstimationTemplate[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<EstimationTemplate> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`EstimationTemplate ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateEstimationTemplateDto): Promise<EstimationTemplate> {
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
