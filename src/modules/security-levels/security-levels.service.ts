import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityLevel } from './entities/SecurityLevel.entity';
import { CreateSecurityLevelDto } from './dto/create-security-levels.dto';
import { UpdateSecurityLevelDto } from './dto/update-security-levels.dto';

@Injectable()
export class SecurityLevelsService {
  constructor(@InjectRepository(SecurityLevel) private readonly repository: Repository<SecurityLevel>) {}

  async create(dto: CreateSecurityLevelDto): Promise<SecurityLevel> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<SecurityLevel[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<SecurityLevel> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`SecurityLevel ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateSecurityLevelDto): Promise<SecurityLevel> {
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
