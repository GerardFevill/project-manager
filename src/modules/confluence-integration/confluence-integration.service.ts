import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfluencePage } from './entities/ConfluencePage.entity';
import { CreateConfluencePageDto } from './dto/create-confluence-integration.dto';
import { UpdateConfluencePageDto } from './dto/update-confluence-integration.dto';

@Injectable()
export class ConfluenceIntegrationService {
  constructor(@InjectRepository(ConfluencePage) private readonly repository: Repository<ConfluencePage>) {}

  async create(dto: CreateConfluencePageDto): Promise<ConfluencePage> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ConfluencePage[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ConfluencePage> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ConfluencePage ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateConfluencePageDto): Promise<ConfluencePage> {
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
