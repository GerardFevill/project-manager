import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IssueChange } from './entities/issue-change.entity';

@Injectable()
export class IssueHistoryService {
  constructor(
    @InjectRepository(IssueChange)
    private readonly changeRepository: Repository<IssueChange>,
  ) {}

  async recordChange(
    issueId: string,
    userId: string,
    changeType: string,
    fieldName?: string,
    oldValue?: any,
    newValue?: any,
    changeDescription?: string,
    metadata?: Record<string, any>,
  ): Promise<IssueChange> {
    const change = this.changeRepository.create({
      issueId,
      userId,
      changeType,
      fieldName,
      oldValue: oldValue ? String(oldValue) : null,
      newValue: newValue ? String(newValue) : null,
      changeDescription,
      metadata,
      createdAt: new Date(),
    });

    return this.changeRepository.save(change);
  }

  async getIssueHistory(issueId: string, limit: number = 100, offset: number = 0): Promise<IssueChange[]> {
    return this.changeRepository.find({
      where: { issueId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getFieldHistory(issueId: string, fieldName: string): Promise<IssueChange[]> {
    return this.changeRepository.find({
      where: { issueId, fieldName },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getUserActivity(userId: string, limit: number = 50): Promise<IssueChange[]> {
    return this.changeRepository.find({
      where: { userId },
      relations: ['issue', 'user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getRecentChanges(projectId?: string, limit: number = 50): Promise<IssueChange[]> {
    const qb = this.changeRepository
      .createQueryBuilder('change')
      .leftJoinAndSelect('change.issue', 'issue')
      .leftJoinAndSelect('change.user', 'user')
      .orderBy('change.createdAt', 'DESC')
      .take(limit);

    if (projectId) {
      qb.where('issue.projectId = :projectId', { projectId });
    }

    return qb.getMany();
  }

  async getChangesBetween(issueId: string, startDate: Date, endDate: Date): Promise<IssueChange[]> {
    return this.changeRepository
      .createQueryBuilder('change')
      .where('change.issueId = :issueId', { issueId })
      .andWhere('change.createdAt >= :startDate', { startDate })
      .andWhere('change.createdAt <= :endDate', { endDate })
      .leftJoinAndSelect('change.user', 'user')
      .orderBy('change.createdAt', 'ASC')
      .getMany();
  }

  async getHistoryStats(issueId: string): Promise<{
    totalChanges: number;
    fieldChanges: number;
    statusChanges: number;
    contributors: number;
  }> {
    const changes = await this.changeRepository.find({ where: { issueId } });

    const uniqueUsers = new Set(changes.map(c => c.userId).filter(Boolean));

    return {
      totalChanges: changes.length,
      fieldChanges: changes.filter(c => c.changeType === 'field_change').length,
      statusChanges: changes.filter(c => c.changeType === 'status_change').length,
      contributors: uniqueUsers.size,
    };
  }
}
