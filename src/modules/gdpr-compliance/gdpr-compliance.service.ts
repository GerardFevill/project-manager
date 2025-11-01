import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GdprLog } from './entities/GdprLog.entity';
import { CreateGdprLogDto } from './dto/create-gdpr-compliance.dto';
import { UpdateGdprLogDto } from './dto/update-gdpr-compliance.dto';

@Injectable()
export class GdprComplianceService {
  constructor(@InjectRepository(GdprLog) private readonly repository: Repository<GdprLog>) {}

  async create(dto: CreateGdprLogDto): Promise<GdprLog> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<GdprLog[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<GdprLog> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`GdprLog ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateGdprLogDto): Promise<GdprLog> {
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
