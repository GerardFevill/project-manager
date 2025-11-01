import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookTemplate } from './entities/WebhookTemplate.entity';
import { CreateWebhookTemplateDto } from './dto/create-webhook-templates.dto';
import { UpdateWebhookTemplateDto } from './dto/update-webhook-templates.dto';

@Injectable()
export class WebhookTemplatesService {
  constructor(@InjectRepository(WebhookTemplate) private readonly repository: Repository<WebhookTemplate>) {}

  async create(dto: CreateWebhookTemplateDto): Promise<WebhookTemplate> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<WebhookTemplate[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<WebhookTemplate> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`WebhookTemplate ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateWebhookTemplateDto): Promise<WebhookTemplate> {
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
