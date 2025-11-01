import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './entities/label.entity';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelsService {
  constructor(
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
  ) {}

  async findAll(): Promise<Label[]> {
    return this.labelRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Label> {
    const label = await this.labelRepository.findOne({
      where: { id },
    });

    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }

    return label;
  }

  async findByName(name: string): Promise<Label | null> {
    return this.labelRepository.findOne({
      where: { name },
    });
  }

  async create(createLabelDto: CreateLabelDto): Promise<Label> {
    // Check if label already exists
    const existing = await this.findByName(createLabelDto.name);
    if (existing) {
      throw new ConflictException(`Label with name ${createLabelDto.name} already exists`);
    }

    const label = this.labelRepository.create({
      ...createLabelDto,
      createdAt: new Date(),
    });

    return this.labelRepository.save(label);
  }

  async update(id: string, updateLabelDto: UpdateLabelDto): Promise<Label> {
    const label = await this.findOne(id);

    // Check name uniqueness if being updated
    if (updateLabelDto.name && updateLabelDto.name !== label.name) {
      const existing = await this.findByName(updateLabelDto.name);
      if (existing) {
        throw new ConflictException(`Label with name ${updateLabelDto.name} already exists`);
      }
    }

    Object.assign(label, updateLabelDto);

    return this.labelRepository.save(label);
  }

  async remove(id: string): Promise<void> {
    const label = await this.findOne(id);
    await this.labelRepository.remove(label);
  }

  async search(query: string): Promise<Label[]> {
    return this.labelRepository
      .createQueryBuilder('label')
      .where('LOWER(label.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(label.description) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('label.name', 'ASC')
      .getMany();
  }
}
