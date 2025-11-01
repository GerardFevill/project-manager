import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WorkLog } from '../work-logs/entities/work-log.entity';

@Injectable()
export class TimeReportsService {
  constructor(
    @InjectRepository(WorkLog)
    private readonly workLogRepository: Repository<WorkLog>,
  ) {}

  async getUserTimeReport(userId: string, startDate: Date, endDate: Date): Promise<any> {
    const workLogs = await this.workLogRepository.find({
      where: {
        userId,
        startedAt: Between(startDate, endDate),
      },
      relations: ['issue'],
    });

    const totalMinutes = workLogs.reduce((sum, log) => sum + log.timeSpentMinutes, 0);

    return {
      userId,
      period: { startDate, endDate },
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      totalMinutes,
      workLogCount: workLogs.length,
      workLogs,
    };
  }

  async getProjectTimeReport(projectId: string, startDate: Date, endDate: Date): Promise<any> {
    const workLogs = await this.workLogRepository
      .createQueryBuilder('workLog')
      .leftJoinAndSelect('workLog.issue', 'issue')
      .leftJoinAndSelect('workLog.user', 'user')
      .where('issue.projectId = :projectId', { projectId })
      .andWhere('workLog.startedAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const totalMinutes = workLogs.reduce((sum, log) => sum + log.timeSpentMinutes, 0);

    return {
      projectId,
      period: { startDate, endDate },
      totalHours: Math.round((totalMinutes / 60) * 100) / 100,
      totalMinutes,
      workLogCount: workLogs.length,
      byUser: this.groupByUser(workLogs),
    };
  }

  private groupByUser(workLogs: WorkLog[]): any[] {
    const grouped = workLogs.reduce((acc, log) => {
      if (!acc[log.userId]) {
        acc[log.userId] = {
          userId: log.userId,
          totalMinutes: 0,
          count: 0,
        };
      }
      acc[log.userId].totalMinutes += log.timeSpentMinutes;
      acc[log.userId].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).map((item: any) => ({
      ...item,
      totalHours: Math.round((item.totalMinutes / 60) * 100) / 100,
    }));
  }
}
