import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Migration } from './entities/Migration.entity';
import { CreateMigrationDto } from './dto/create-migration-tools.dto';
import { UpdateMigrationDto } from './dto/update-migration-tools.dto';

@Injectable()
export class MigrationToolsService {
  constructor(@InjectRepository(Migration) private readonly repository: Repository<Migration>) {}

  async create(dto: CreateMigrationDto): Promise<Migration> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Migration[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Migration> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Migration ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateMigrationDto): Promise<Migration> {
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
