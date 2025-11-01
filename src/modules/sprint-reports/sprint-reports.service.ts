import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprintReport } from './entities/SprintReport.entity';
import { CreateSprintReportDto } from './dto/create-sprint-reports.dto';
import { UpdateSprintReportDto } from './dto/update-sprint-reports.dto';

@Injectable()
export class SprintReportsService {
  constructor(@InjectRepository(SprintReport) private readonly repository: Repository<SprintReport>) {}

  async create(dto: CreateSprintReportDto): Promise<SprintReport> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<SprintReport[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<SprintReport> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`SprintReport ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateSprintReportDto): Promise<SprintReport> {
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
