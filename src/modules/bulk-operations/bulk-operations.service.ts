import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BulkOperation } from './entities/BulkOperation.entity';
import { CreateBulkOperationDto } from './dto/create-bulk-operations.dto';
import { UpdateBulkOperationDto } from './dto/update-bulk-operations.dto';

@Injectable()
export class BulkOperationsService {
  constructor(@InjectRepository(BulkOperation) private readonly repository: Repository<BulkOperation>) {}

  async create(dto: CreateBulkOperationDto): Promise<BulkOperation> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<BulkOperation[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<BulkOperation> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`BulkOperation ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateBulkOperationDto): Promise<BulkOperation> {
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
