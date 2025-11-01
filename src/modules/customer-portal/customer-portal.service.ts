import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerTicket } from './entities/CustomerTicket.entity';
import { CreateCustomerTicketDto } from './dto/create-customer-portal.dto';
import { UpdateCustomerTicketDto } from './dto/update-customer-portal.dto';

@Injectable()
export class CustomerPortalService {
  constructor(@InjectRepository(CustomerTicket) private readonly repository: Repository<CustomerTicket>) {}

  async create(dto: CreateCustomerTicketDto): Promise<CustomerTicket> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CustomerTicket[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CustomerTicket> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CustomerTicket ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCustomerTicketDto): Promise<CustomerTicket> {
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
