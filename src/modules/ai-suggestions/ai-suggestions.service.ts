import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiSuggestion } from './entities/AiSuggestion.entity';
import { CreateAiSuggestionDto } from './dto/create-ai-suggestions.dto';
import { UpdateAiSuggestionDto } from './dto/update-ai-suggestions.dto';

@Injectable()
export class AiSuggestionsService {
  constructor(@InjectRepository(AiSuggestion) private readonly repository: Repository<AiSuggestion>) {}

  async create(dto: CreateAiSuggestionDto): Promise<AiSuggestion> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<AiSuggestion[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<AiSuggestion> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`AiSuggestion ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateAiSuggestionDto): Promise<AiSuggestion> {
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
