import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSheet } from './entities/TimeSheet.entity';
import { CreateTimeSheetDto } from './dto/create-timesheets.dto';
import { UpdateTimeSheetDto } from './dto/update-timesheets.dto';

@Injectable()
export class TimeSheetsService {
  constructor(@InjectRepository(TimeSheet) private readonly repository: Repository<TimeSheet>) {}

  async create(dto: CreateTimeSheetDto): Promise<TimeSheet> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<TimeSheet[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<TimeSheet> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`TimeSheet ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateTimeSheetDto): Promise<TimeSheet> {
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
