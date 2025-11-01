import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/Incident.entity';
import { CreateIncidentDto } from './dto/create-incident-management.dto';
import { UpdateIncidentDto } from './dto/update-incident-management.dto';

@Injectable()
export class IncidentManagementService {
  constructor(@InjectRepository(Incident) private readonly repository: Repository<Incident>) {}

  async create(dto: CreateIncidentDto): Promise<Incident> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Incident[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Incident> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Incident ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateIncidentDto): Promise<Incident> {
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
