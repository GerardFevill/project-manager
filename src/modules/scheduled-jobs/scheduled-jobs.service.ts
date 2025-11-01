import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledJob } from './entities/ScheduledJob.entity';
import { CreateScheduledJobDto } from './dto/create-scheduled-jobs.dto';
import { UpdateScheduledJobDto } from './dto/update-scheduled-jobs.dto';

@Injectable()
export class ScheduledJobsService {
  constructor(@InjectRepository(ScheduledJob) private readonly repository: Repository<ScheduledJob>) {}

  async create(dto: CreateScheduledJobDto): Promise<ScheduledJob> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ScheduledJob[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ScheduledJob> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ScheduledJob ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateScheduledJobDto): Promise<ScheduledJob> {
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
