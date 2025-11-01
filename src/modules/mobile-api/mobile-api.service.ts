import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MobileSession } from './entities/MobileSession.entity';
import { CreateMobileSessionDto } from './dto/create-mobile-api.dto';
import { UpdateMobileSessionDto } from './dto/update-mobile-api.dto';

@Injectable()
export class MobileApiService {
  constructor(@InjectRepository(MobileSession) private readonly repository: Repository<MobileSession>) {}

  async create(dto: CreateMobileSessionDto): Promise<MobileSession> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<MobileSession[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<MobileSession> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`MobileSession ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateMobileSessionDto): Promise<MobileSession> {
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
