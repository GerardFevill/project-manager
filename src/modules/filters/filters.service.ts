import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filter, FilterScope } from './entities/filter.entity';
import { CreateFilterDto } from './dto/create-filter.dto';
import { UpdateFilterDto } from './dto/update-filter.dto';
import { ExecuteFilterDto } from './dto/execute-filter.dto';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Filter)
    private readonly filterRepository: Repository<Filter>,
  ) {}

  async create(createFilterDto: CreateFilterDto, ownerId: string): Promise<Filter> {
    const filter = this.filterRepository.create({
      ...createFilterDto,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.filterRepository.save(filter);
  }

  async findAll(userId: string): Promise<Filter[]> {
    // Return filters that are:
    // 1. Owned by the user
    // 2. Global scope
    // 3. Shared with the user
    return this.filterRepository
      .createQueryBuilder('filter')
      .where('filter.ownerId = :userId', { userId })
      .orWhere('filter.scope = :scope', { scope: FilterScope.GLOBAL })
      .orWhere(':userId = ANY(filter.sharedWith)', { userId })
      .orderBy('filter.name', 'ASC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<Filter> {
    const filter = await this.filterRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!filter) {
      throw new NotFoundException(`Filter with ID ${id} not found`);
    }

    // Check access
    this.checkAccess(filter, userId);

    return filter;
  }

  async findFavorites(userId: string): Promise<Filter[]> {
    return this.filterRepository.find({
      where: { ownerId: userId, isFavorite: true },
      order: { name: 'ASC' },
    });
  }

  async findByProject(projectId: string, userId: string): Promise<Filter[]> {
    return this.filterRepository
      .createQueryBuilder('filter')
      .where('filter.projectId = :projectId', { projectId })
      .andWhere(
        '(filter.ownerId = :userId OR filter.scope = :globalScope OR :userId = ANY(filter.sharedWith))',
        { userId, globalScope: FilterScope.GLOBAL },
      )
      .orderBy('filter.name', 'ASC')
      .getMany();
  }

  async update(id: string, updateFilterDto: UpdateFilterDto, userId: string): Promise<Filter> {
    const filter = await this.findOne(id, userId);

    // Only owner can update
    if (filter.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can update this filter');
    }

    Object.assign(filter, updateFilterDto);
    filter.updatedAt = new Date();

    return this.filterRepository.save(filter);
  }

  async remove(id: string, userId: string): Promise<void> {
    const filter = await this.findOne(id, userId);

    // Only owner can delete
    if (filter.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete this filter');
    }

    await this.filterRepository.remove(filter);
  }

  async incrementUsage(id: string): Promise<void> {
    await this.filterRepository.increment({ id }, 'usageCount', 1);
  }

  // JQL Execution (simplified - in production you'd parse and execute JQL)
  async executeJQL(executeFilterDto: ExecuteFilterDto): Promise<any> {
    const { jql, offset = 0, limit = 50 } = executeFilterDto;

    // TODO: Implement full JQL parser and executor
    // For now, return a placeholder response
    // In production, this would:
    // 1. Parse the JQL string
    // 2. Build a TypeORM query
    // 3. Execute and return results

    return {
      jql,
      offset,
      limit,
      total: 0,
      issues: [],
      message: 'JQL execution not yet implemented - requires full parser',
    };
  }

  async validateJQL(jql: string): Promise<{ valid: boolean; error?: string }> {
    // TODO: Implement JQL validation
    // Basic validation for now
    if (!jql || jql.trim().length === 0) {
      return { valid: false, error: 'JQL cannot be empty' };
    }

    return { valid: true };
  }

  private checkAccess(filter: Filter, userId: string): void {
    const hasAccess =
      filter.ownerId === userId ||
      filter.scope === FilterScope.GLOBAL ||
      (filter.sharedWith && filter.sharedWith.includes(userId));

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this filter');
    }
  }
}
