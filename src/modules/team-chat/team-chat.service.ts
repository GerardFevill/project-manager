import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/ChatMessage.entity';
import { CreateChatMessageDto } from './dto/create-team-chat.dto';
import { UpdateChatMessageDto } from './dto/update-team-chat.dto';

@Injectable()
export class TeamChatService {
  constructor(@InjectRepository(ChatMessage) private readonly repository: Repository<ChatMessage>) {}

  async create(dto: CreateChatMessageDto): Promise<ChatMessage> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<ChatMessage[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<ChatMessage> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`ChatMessage ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateChatMessageDto): Promise<ChatMessage> {
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
