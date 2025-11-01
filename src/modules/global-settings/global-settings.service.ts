import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalSetting } from './entities/GlobalSetting.entity';
import { CreateGlobalSettingDto } from './dto/create-global-settings.dto';
import { UpdateGlobalSettingDto } from './dto/update-global-settings.dto';

@Injectable()
export class GlobalSettingsService {
  constructor(@InjectRepository(GlobalSetting) private readonly repository: Repository<GlobalSetting>) {}

  async create(dto: CreateGlobalSettingDto): Promise<GlobalSetting> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<GlobalSetting[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<GlobalSetting> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`GlobalSetting ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateGlobalSettingDto): Promise<GlobalSetting> {
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
