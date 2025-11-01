import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloneOperation } from './entities/CloneOperation.entity';
import { CreateCloneOperationDto } from './dto/create-project-cloning.dto';
import { UpdateCloneOperationDto } from './dto/update-project-cloning.dto';

@Injectable()
export class ProjectCloningService {
  constructor(@InjectRepository(CloneOperation) private readonly repository: Repository<CloneOperation>) {}

  async create(dto: CreateCloneOperationDto): Promise<CloneOperation> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<CloneOperation[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<CloneOperation> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`CloneOperation ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateCloneOperationDto): Promise<CloneOperation> {
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
