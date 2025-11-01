import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OAuthApp } from './entities/OAuthApp.entity';
import { CreateOAuthAppDto } from './dto/create-oauth-apps.dto';
import { UpdateOAuthAppDto } from './dto/update-oauth-apps.dto';

@Injectable()
export class OAuthAppsService {
  constructor(@InjectRepository(OAuthApp) private readonly repository: Repository<OAuthApp>) {}

  async create(dto: CreateOAuthAppDto): Promise<OAuthApp> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<OAuthApp[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<OAuthApp> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`OAuthApp ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateOAuthAppDto): Promise<OAuthApp> {
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
