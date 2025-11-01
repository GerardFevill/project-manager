import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldConfiguration } from './entities/FieldConfiguration.entity';
import { CreateFieldConfigurationDto } from './dto/create-field-configurations.dto';
import { UpdateFieldConfigurationDto } from './dto/update-field-configurations.dto';

@Injectable()
export class FieldConfigurationsService {
  constructor(@InjectRepository(FieldConfiguration) private readonly repository: Repository<FieldConfiguration>) {}

  async create(dto: CreateFieldConfigurationDto): Promise<FieldConfiguration> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<FieldConfiguration[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<FieldConfiguration> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`FieldConfiguration ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateFieldConfigurationDto): Promise<FieldConfiguration> {
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
