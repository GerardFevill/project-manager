import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartNotification } from './entities/SmartNotification.entity';
import { CreateSmartNotificationDto } from './dto/create-smart-notifications.dto';
import { UpdateSmartNotificationDto } from './dto/update-smart-notifications.dto';

@Injectable()
export class SmartNotificationsService {
  constructor(@InjectRepository(SmartNotification) private readonly repository: Repository<SmartNotification>) {}

  async create(dto: CreateSmartNotificationDto): Promise<SmartNotification> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<SmartNotification[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<SmartNotification> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`SmartNotification ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateSmartNotificationDto): Promise<SmartNotification> {
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
