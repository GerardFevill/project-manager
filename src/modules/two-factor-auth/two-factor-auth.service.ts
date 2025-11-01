import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TwoFactorAuth } from './entities/TwoFactorAuth.entity';
import { CreateTwoFactorAuthDto } from './dto/create-two-factor-auth.dto';
import { UpdateTwoFactorAuthDto } from './dto/update-two-factor-auth.dto';

@Injectable()
export class TwoFactorAuthService {
  constructor(@InjectRepository(TwoFactorAuth) private readonly repository: Repository<TwoFactorAuth>) {}

  async create(dto: CreateTwoFactorAuthDto): Promise<TwoFactorAuth> {
    const entity = this.repository.create({ ...dto, createdAt: new Date(), updatedAt: new Date() });
    return this.repository.save(entity);
  }

  async findAll(): Promise<TwoFactorAuth[]> {
    return this.repository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async findOne(id: string): Promise<TwoFactorAuth> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`TwoFactorAuth ${id} not found`);
    return entity;
  }

  async update(id: string, dto: UpdateTwoFactorAuthDto): Promise<TwoFactorAuth> {
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
