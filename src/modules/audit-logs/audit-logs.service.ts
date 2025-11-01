import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    changes?: Record<string, any>,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<AuditLog> {
    const log = this.auditLogRepository.create({
      action,
      entityType,
      entityId,
      userId,
      changes,
      metadata,
      ipAddress,
      userAgent,
      createdAt: new Date(),
    });

    return this.auditLogRepository.save(log);
  }

  async findAll(filters: {
    entityType?: string;
    entityId?: string;
    userId?: string;
    action?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: AuditLog[]; total: number }> {
    const qb = this.auditLogRepository.createQueryBuilder('log').leftJoinAndSelect('log.user', 'user');

    if (filters.entityType) {
      qb.andWhere('log.entityType = :entityType', { entityType: filters.entityType });
    }

    if (filters.entityId) {
      qb.andWhere('log.entityId = :entityId', { entityId: filters.entityId });
    }

    if (filters.userId) {
      qb.andWhere('log.userId = :userId', { userId: filters.userId });
    }

    if (filters.action) {
      qb.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters.startDate && filters.endDate) {
      qb.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    const total = await qb.getCount();

    qb.orderBy('log.createdAt', 'DESC')
      .take(filters.limit || 50)
      .skip(filters.offset || 0);

    const logs = await qb.getMany();

    return { logs, total };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
