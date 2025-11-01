import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequest } from './entities/ChangeRequest.entity';
import { CreateChangeRequestDto } from './dto/create-change-management.dto';
import { UpdateChangeRequestDto } from './dto/update-change-management.dto';

@Injectable()
export class ChangeManagementService {
  constructor(@InjectRepository(ChangeRequest) private readonly repository: Repository<ChangeRequest>) {}

  async create(dto: CreateChangeRequestDto): Promise<ChangeRequest> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ChangeRequest[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ChangeRequest> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ChangeRequest ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateChangeRequestDto): Promise<ChangeRequest> {
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
