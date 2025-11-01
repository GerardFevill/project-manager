import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Release } from './entities/release.entity';
import { CreateReleaseDto } from './dto/create-release-management.dto';
import { UpdateReleaseDto } from './dto/update-release-management.dto';

@Injectable()
export class ReleaseManagementService {
  constructor(@InjectRepository(Release) private readonly repository: Repository<Release>) {}

  async create(dto: CreateReleaseDto): Promise<Release> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Release[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Release> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Release ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateReleaseDto): Promise<Release> {
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
