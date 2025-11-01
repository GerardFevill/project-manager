import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationScheme } from './entities/NotificationScheme.entity';
import { CreateNotificationSchemeDto } from './dto/create-notification-schemes.dto';
import { UpdateNotificationSchemeDto } from './dto/update-notification-schemes.dto';

@Injectable()
export class NotificationSchemesService {
  constructor(@InjectRepository(NotificationScheme) private readonly repository: Repository<NotificationScheme>) {}

  async create(dto: CreateNotificationSchemeDto): Promise<NotificationScheme> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<NotificationScheme[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<NotificationScheme> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`NotificationScheme ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateNotificationSchemeDto): Promise<NotificationScheme> {
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
