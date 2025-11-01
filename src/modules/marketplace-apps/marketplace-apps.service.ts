import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketplaceApp } from './entities/MarketplaceApp.entity';
import { CreateMarketplaceAppDto } from './dto/create-marketplace-apps.dto';
import { UpdateMarketplaceAppDto } from './dto/update-marketplace-apps.dto';

@Injectable()
export class MarketplaceAppsService {
  constructor(@InjectRepository(MarketplaceApp) private readonly repository: Repository<MarketplaceApp>) {}

  async create(dto: CreateMarketplaceAppDto): Promise<MarketplaceApp> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<MarketplaceApp[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<MarketplaceApp> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`MarketplaceApp ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateMarketplaceAppDto): Promise<MarketplaceApp> {
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
