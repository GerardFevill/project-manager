import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodeCommit } from './entities/CodeCommit.entity';
import { CreateCodeCommitDto } from './dto/create-code-integration.dto';
import { UpdateCodeCommitDto } from './dto/update-code-integration.dto';

@Injectable()
export class CodeIntegrationService {
  constructor(@InjectRepository(CodeCommit) private readonly repository: Repository<CodeCommit>) {}

  async create(dto: CreateCodeCommitDto): Promise<CodeCommit> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CodeCommit[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CodeCommit> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CodeCommit ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCodeCommitDto): Promise<CodeCommit> {
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
