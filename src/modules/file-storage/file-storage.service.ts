import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileStorage } from './entities/FileStorage.entity';
import { CreateFileStorageDto } from './dto/create-file-storage.dto';
import { UpdateFileStorageDto } from './dto/update-file-storage.dto';

@Injectable()
export class FileStorageService {
  constructor(@InjectRepository(FileStorage) private readonly repository: Repository<FileStorage>) {}

  async create(dto: CreateFileStorageDto): Promise<FileStorage> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<FileStorage[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<FileStorage> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`FileStorage ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateFileStorageDto): Promise<FileStorage> {
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
