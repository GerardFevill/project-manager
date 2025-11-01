import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BurnData } from './entities/burn-data.entity';
import { CreateBurnDataDto } from './dto/create-burn-charts.dto';
import { UpdateBurnDataDto } from './dto/update-burn-charts.dto';

@Injectable()
export class BurnChartsService {
  constructor(@InjectRepository(BurnData) private readonly repository: Repository<BurnData>) {}

  async create(dto: CreateBurnDataDto): Promise<BurnData> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<BurnData[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<BurnData> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`BurnData ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateBurnDataDto): Promise<BurnData> {
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
