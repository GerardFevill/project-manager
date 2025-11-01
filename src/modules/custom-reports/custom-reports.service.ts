import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomReport } from './entities/CustomReport.entity';
import { CreateCustomReportDto } from './dto/create-custom-reports.dto';
import { UpdateCustomReportDto } from './dto/update-custom-reports.dto';

@Injectable()
export class CustomReportsService {
  constructor(@InjectRepository(CustomReport) private readonly repository: Repository<CustomReport>) {}

  async create(dto: CreateCustomReportDto): Promise<CustomReport> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CustomReport[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CustomReport> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CustomReport ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCustomReportDto): Promise<CustomReport> {
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
