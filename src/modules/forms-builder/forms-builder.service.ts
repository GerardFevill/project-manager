import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormTemplate } from './entities/FormTemplate.entity';
import { CreateFormTemplateDto } from './dto/create-forms-builder.dto';
import { UpdateFormTemplateDto } from './dto/update-forms-builder.dto';

@Injectable()
export class FormsBuilderService {
  constructor(@InjectRepository(FormTemplate) private readonly repository: Repository<FormTemplate>) {}

  async create(dto: CreateFormTemplateDto): Promise<FormTemplate> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<FormTemplate[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<FormTemplate> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`FormTemplate ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateFormTemplateDto): Promise<FormTemplate> {
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
