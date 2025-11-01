import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeArticle } from './entities/KnowledgeArticle.entity';
import { CreateKnowledgeArticleDto } from './dto/create-knowledge-base.dto';
import { UpdateKnowledgeArticleDto } from './dto/update-knowledge-base.dto';

@Injectable()
export class KnowledgeBaseService {
  constructor(@InjectRepository(KnowledgeArticle) private readonly repository: Repository<KnowledgeArticle>) {}

  async create(dto: CreateKnowledgeArticleDto): Promise<KnowledgeArticle> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<KnowledgeArticle[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<KnowledgeArticle> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`KnowledgeArticle ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateKnowledgeArticleDto): Promise<KnowledgeArticle> {
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
