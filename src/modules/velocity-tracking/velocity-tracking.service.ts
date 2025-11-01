import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Velocity } from './entities/Velocity.entity';
import { CreateVelocityDto } from './dto/create-velocity-tracking.dto';
import { UpdateVelocityDto } from './dto/update-velocity-tracking.dto';

@Injectable()
export class VelocityTrackingService {
  constructor(@InjectRepository(Velocity) private readonly repository: Repository<Velocity>) {}

  async create(dto: CreateVelocityDto): Promise<Velocity> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Velocity[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Velocity> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Velocity ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateVelocityDto): Promise<Velocity> {
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
