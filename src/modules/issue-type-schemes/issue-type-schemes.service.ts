import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueTypeScheme } from './entities/IssueTypeScheme.entity';
import { CreateIssueTypeSchemeDto } from './dto/create-issue-type-schemes.dto';
import { UpdateIssueTypeSchemeDto } from './dto/update-issue-type-schemes.dto';

@Injectable()
export class IssueTypeSchemesService {
  constructor(@InjectRepository(IssueTypeScheme) private readonly repository: Repository<IssueTypeScheme>) {}

  async create(dto: CreateIssueTypeSchemeDto): Promise<IssueTypeScheme> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<IssueTypeScheme[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<IssueTypeScheme> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`IssueTypeScheme ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateIssueTypeSchemeDto): Promise<IssueTypeScheme> {
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
