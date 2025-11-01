import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/ApiKey.entity';
import { CreateApiKeyDto } from './dto/create-api-keys.dto';
import { UpdateApiKeyDto } from './dto/update-api-keys.dto';

@Injectable()
export class ApiKeysService {
  constructor(@InjectRepository(ApiKey) private readonly repository: Repository<ApiKey>) {}

  async create(dto: CreateApiKeyDto): Promise<ApiKey> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ApiKey[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ApiKey> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ApiKey ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
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
