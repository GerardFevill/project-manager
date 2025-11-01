import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SLA } from './entities/sla.entity';

@Injectable()
export class SLAService {
  constructor(
    @InjectRepository(SLA)
    private readonly slaRepository: Repository<SLA>,
  ) {}

  async create(data: Partial<SLA>): Promise<SLA> {
    const sla = this.slaRepository.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.slaRepository.save(sla);
  }

  async findAll(projectId?: string): Promise<SLA[]> {
    const query: any = { isActive: true };
    if (projectId) query.projectId = projectId;
    return this.slaRepository.find({ where: query, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<SLA> {
    const sla = await this.slaRepository.findOne({ where: { id } });
    if (!sla) throw new NotFoundException(`SLA with ID ${id} not found`);
    return sla;
  }

  async update(id: string, data: Partial<SLA>): Promise<SLA> {
    const sla = await this.findOne(id);
    Object.assign(sla, data);
    sla.updatedAt = new Date();
    return this.slaRepository.save(sla);
  }

  async remove(id: string): Promise<void> {
    const sla = await this.findOne(id);
    await this.slaRepository.remove(sla);
  }
}
