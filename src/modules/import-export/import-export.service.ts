import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportExport } from './entities/ImportExport.entity';
import { CreateImportExportDto } from './dto/create-import-export.dto';
import { UpdateImportExportDto } from './dto/update-import-export.dto';

@Injectable()
export class ImportExportService {
  constructor(@InjectRepository(ImportExport) private readonly repository: Repository<ImportExport>) {}

  async create(dto: CreateImportExportDto): Promise<ImportExport> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ImportExport[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ImportExport> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ImportExport ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateImportExportDto): Promise<ImportExport> {
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
