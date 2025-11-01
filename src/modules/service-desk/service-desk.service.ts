import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRequest } from './entities/ServiceRequest.entity';
import { CreateServiceRequestDto } from './dto/create-service-desk.dto';
import { UpdateServiceRequestDto } from './dto/update-service-desk.dto';

@Injectable()
export class ServiceDeskService {
  constructor(@InjectRepository(ServiceRequest) private readonly repository: Repository<ServiceRequest>) {}

  async create(dto: CreateServiceRequestDto): Promise<ServiceRequest> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ServiceRequest[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ServiceRequest> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ServiceRequest ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateServiceRequestDto): Promise<ServiceRequest> {
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
