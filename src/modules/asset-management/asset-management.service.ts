import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/Asset.entity';
import { CreateAssetDto } from './dto/create-asset-management.dto';
import { UpdateAssetDto } from './dto/update-asset-management.dto';

@Injectable()
export class AssetManagementService {
  constructor(@InjectRepository(Asset) private readonly repository: Repository<Asset>) {}

  async create(dto: CreateAssetDto): Promise<Asset> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Asset[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Asset> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Asset ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateAssetDto): Promise<Asset> {
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
