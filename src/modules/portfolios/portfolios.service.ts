import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(data: Partial<Portfolio>): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create(data);
    return this.portfolioRepository.save(portfolio);
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({ relations: ['owner'], order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!portfolio) throw new NotFoundException(`Portfolio ${id} not found`);
    return portfolio;
  }

  async update(id: string, data: Partial<Portfolio>): Promise<Portfolio> {
    const portfolio = await this.findOne(id);
    Object.assign(portfolio, data);
    return this.portfolioRepository.save(portfolio);
  }

  async remove(id: string): Promise<void> {
    const portfolio = await this.findOne(id);
    await this.portfolioRepository.remove(portfolio);
  }
}
