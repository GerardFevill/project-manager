import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Component } from './entities/component.entity';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

@Injectable()
export class ComponentsService {
  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,
  ) {}

  async findAll(projectId?: string): Promise<Component[]> {
    const query = this.componentRepository
      .createQueryBuilder('component')
      .leftJoinAndSelect('component.project', 'project')
      .leftJoinAndSelect('component.lead', 'lead')
      .where('component.isArchived = :isArchived', { isArchived: false })
      .orderBy('component.name', 'ASC');

    if (projectId) {
      query.andWhere('component.projectId = :projectId', { projectId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Component> {
    const component = await this.componentRepository.findOne({
      where: { id },
      relations: ['project', 'lead'],
    });

    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }

    return component;
  }

  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    // Check if component with same name exists in project
    const existing = await this.componentRepository.findOne({
      where: {
        projectId: createComponentDto.projectId,
        name: createComponentDto.name,
      },
    });

    if (existing) {
      throw new ConflictException(`Component ${createComponentDto.name} already exists in this project`);
    }

    const component = this.componentRepository.create({
      ...createComponentDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.componentRepository.save(component);
  }

  async update(id: string, updateComponentDto: UpdateComponentDto): Promise<Component> {
    const component = await this.findOne(id);

    // Check name uniqueness if being updated
    if (updateComponentDto.name && updateComponentDto.name !== component.name) {
      const existing = await this.componentRepository.findOne({
        where: {
          projectId: component.projectId,
          name: updateComponentDto.name,
        },
      });

      if (existing) {
        throw new ConflictException(`Component ${updateComponentDto.name} already exists in this project`);
      }
    }

    Object.assign(component, updateComponentDto);
    component.updatedAt = new Date();

    return this.componentRepository.save(component);
  }

  async remove(id: string): Promise<void> {
    const component = await this.findOne(id);
    await this.componentRepository.remove(component);
  }

  async findByProject(projectId: string): Promise<Component[]> {
    return this.componentRepository.find({
      where: { projectId, isArchived: false },
      relations: ['lead'],
      order: { name: 'ASC' },
    });
  }

  async archive(id: string): Promise<Component> {
    const component = await this.findOne(id);
    component.isArchived = true;
    component.updatedAt = new Date();
    return this.componentRepository.save(component);
  }

  async unarchive(id: string): Promise<Component> {
    const component = await this.findOne(id);
    component.isArchived = false;
    component.updatedAt = new Date();
    return this.componentRepository.save(component);
  }
}
