import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async findAll(issueId?: string, userId?: string): Promise<Activity[]> {
    const query = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.user', 'user')
      .leftJoinAndSelect('activity.issue', 'issue')
      .orderBy('activity.createdAt', 'DESC');

    if (issueId) {
      query.where('activity.issueId = :issueId', { issueId });
    }

    if (userId) {
      query.andWhere('activity.userId = :userId', { userId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['user', 'issue'],
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async create(createActivityDto: CreateActivityDto, userId: string): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      userId,
      createdAt: new Date(),
    });

    return this.activityRepository.save(activity);
  }

  async findByIssue(issueId: string, limit: number = 50): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { issueId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByUser(userId: string, limit: number = 50): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { userId },
      relations: ['issue', 'user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getIssueHistory(issueId: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { issueId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
