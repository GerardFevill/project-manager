import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldContext } from './entities/FieldContext.entity';
import { CreateFieldContextDto } from './dto/create-field-contexts.dto';
import { UpdateFieldContextDto } from './dto/update-field-contexts.dto';

@Injectable()
export class FieldContextsService {
  constructor(@InjectRepository(FieldContext) private readonly repository: Repository<FieldContext>) {}

  async create(dto: CreateFieldContextDto): Promise<FieldContext> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<FieldContext[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<FieldContext> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`FieldContext ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateFieldContextDto): Promise<FieldContext> {
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
