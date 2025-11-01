import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/Invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { UpdateInvoiceDto } from './dto/update-invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(@InjectRepository(Invoice) private readonly repository: Repository<Invoice>) {}

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<Invoice[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<Invoice> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Invoice ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
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
