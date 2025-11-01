import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionScheme } from './entities/PermissionScheme.entity';
import { CreatePermissionSchemeDto } from './dto/create-permission-schemes.dto';
import { UpdatePermissionSchemeDto } from './dto/update-permission-schemes.dto';

@Injectable()
export class PermissionSchemesService {
  constructor(@InjectRepository(PermissionScheme) private readonly repository: Repository<PermissionScheme>) {}

  async create(dto: CreatePermissionSchemeDto): Promise<PermissionScheme> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<PermissionScheme[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<PermissionScheme> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`PermissionScheme ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdatePermissionSchemeDto): Promise<PermissionScheme> {
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
