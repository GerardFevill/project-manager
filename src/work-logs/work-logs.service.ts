import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkLog } from './work-log.entity';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';

@Injectable()
export class WorkLogsService {
  constructor(
    @InjectRepository(WorkLog)
    private readonly workLogRepository: Repository<WorkLog>,
  ) {}

  /**
   * Create a new work log entry
   */
  async create(createWorkLogDto: CreateWorkLogDto): Promise<WorkLog> {
    const workLog = this.workLogRepository.create(createWorkLogDto);
    const saved = await this.workLogRepository.save(workLog);
    return this.findOne(saved.id);
  }

  /**
   * Find all work logs for a task
   */
  async findByTask(taskId: string): Promise<WorkLog[]> {
    return this.workLogRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { workDate: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Find all work logs by a user
   */
  async findByUser(userId: string): Promise<WorkLog[]> {
    return this.workLogRepository.find({
      where: { userId },
      relations: ['task', 'user'],
      order: { workDate: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Find a single work log by ID
   */
  async findOne(id: string): Promise<WorkLog> {
    const workLog = await this.workLogRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });

    if (!workLog) {
      throw new NotFoundException(`Work log with ID ${id} not found`);
    }

    return workLog;
  }

  /**
   * Update a work log
   */
  async update(
    id: string,
    updateWorkLogDto: UpdateWorkLogDto,
    userId: string,
  ): Promise<WorkLog> {
    const workLog = await this.findOne(id);

    // Check if user is the owner
    if (workLog.userId !== userId) {
      throw new ForbiddenException('You can only edit your own work logs');
    }

    // Update fields
    if (updateWorkLogDto.timeSpent !== undefined) {
      workLog.timeSpent = updateWorkLogDto.timeSpent;
    }
    if (updateWorkLogDto.description !== undefined) {
      workLog.description = updateWorkLogDto.description;
    }
    if (updateWorkLogDto.workDate !== undefined) {
      workLog.workDate = new Date(updateWorkLogDto.workDate);
    }

    const updated = await this.workLogRepository.save(workLog);
    return this.findOne(updated.id);
  }

  /**
   * Delete a work log
   */
  async remove(id: string, userId: string): Promise<void> {
    const workLog = await this.findOne(id);

    // Check if user is the owner
    if (workLog.userId !== userId) {
      throw new ForbiddenException('You can only delete your own work logs');
    }

    await this.workLogRepository.remove(workLog);
  }

  /**
   * Get total time logged for a task
   */
  async getTotalTimeByTask(taskId: string): Promise<number> {
    const result = await this.workLogRepository
      .createQueryBuilder('workLog')
      .select('SUM(workLog.timeSpent)', 'total')
      .where('workLog.taskId = :taskId', { taskId })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  /**
   * Get time tracking summary for a task
   */
  async getTaskSummary(taskId: string): Promise<{
    totalLogged: number;
    logCount: number;
    lastLogDate: Date | null;
  }> {
    const logs = await this.findByTask(taskId);
    const totalLogged = logs.reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);
    const lastLogDate = logs.length > 0 ? logs[0].workDate : null;

    return {
      totalLogged,
      logCount: logs.length,
      lastLogDate,
    };
  }
}
