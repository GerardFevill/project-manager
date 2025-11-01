import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataWarehouse } from './entities/DataWarehouse.entity';
import { CreateDataWarehouseDto } from './dto/create-data-warehouse.dto';
import { UpdateDataWarehouseDto } from './dto/update-data-warehouse.dto';

@Injectable()
export class DataWarehouseService {
  constructor(@InjectRepository(DataWarehouse) private readonly repository: Repository<DataWarehouse>) {}

  async create(dto: CreateDataWarehouseDto): Promise<DataWarehouse> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<DataWarehouse[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<DataWarehouse> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`DataWarehouse ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateDataWarehouseDto): Promise<DataWarehouse> {
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
