import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportTemplate } from './entities/ReportTemplate.entity';
import { CreateReportTemplateDto } from './dto/create-report-templates.dto';
import { UpdateReportTemplateDto } from './dto/update-report-templates.dto';

@Injectable()
export class ReportTemplatesService {
  constructor(@InjectRepository(ReportTemplate) private readonly repository: Repository<ReportTemplate>) {}

  async create(dto: CreateReportTemplateDto): Promise<ReportTemplate> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ReportTemplate[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ReportTemplate> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ReportTemplate ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateReportTemplateDto): Promise<ReportTemplate> {
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
