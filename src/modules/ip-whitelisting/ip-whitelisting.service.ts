import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IpWhitelist } from './entities/IpWhitelist.entity';
import { CreateIpWhitelistDto } from './dto/create-ip-whitelisting.dto';
import { UpdateIpWhitelistDto } from './dto/update-ip-whitelisting.dto';

@Injectable()
export class IpWhitelistingService {
  constructor(@InjectRepository(IpWhitelist) private readonly repository: Repository<IpWhitelist>) {}

  async create(dto: CreateIpWhitelistDto): Promise<IpWhitelist> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<IpWhitelist[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<IpWhitelist> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`IpWhitelist ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateIpWhitelistDto): Promise<IpWhitelist> {
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
