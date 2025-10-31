import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import { WorkLog } from '../work-logs/work-log.entity';
import { Comment } from '../comments/comment.entity';

// Simple type aliases for priority and status
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface OverviewReport {
  tasks: {
    total: number;
    byPriority: Record<TaskPriority, number>;
    overdue: number;
    completedThisWeek: number;
    completedThisMonth: number;
  };
  workLogs: {
    totalHours: number;
    thisWeek: number;
    thisMonth: number;
    byUser: { userId: string; userName: string; hours: number }[];
  };
  activity: {
    tasksCreated: number;
    tasksCompleted: number;
    commentsAdded: number;
    workLogsAdded: number;
  };
}

export interface TimeTrackingReport {
  totalHours: number;
  byTask: {
    taskId: string;
    taskTitle: string;
    hours: number;
    estimated: number;
    percentage: number;
  }[];
  byUser: {
    userId: string;
    userName: string;
    hours: number;
    taskCount: number;
  }[];
  byDate: {
    date: string;
    hours: number;
    entriesCount: number;
  }[];
}

export interface UserProductivityReport {
  userId: string;
  userName: string;
  tasksAssigned: number;
  tasksCompleted: number;
  completionRate: number;
  hoursLogged: number;
  averageTaskDuration: number;
  commentsAdded: number;
}

export interface TaskDistributionReport {
  byPriority: { priority: TaskPriority; count: number; percentage: number }[];
  byAssignee: { userId: string; userName: string; count: number }[];
  byIssueType: { type: string; count: number }[];
}

export interface TrendReport {
  period: 'week' | 'month' | 'quarter';
  tasksCreated: { date: string; count: number }[];
  tasksCompleted: { date: string; count: number }[];
  hoursLogged: { date: string; hours: number }[];
  velocity: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(WorkLog)
    private workLogRepository: Repository<WorkLog>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  /**
   * Get comprehensive overview report
   */
  async getOverviewReport(): Promise<OverviewReport> {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Task statistics
    const tasks = await this.taskRepository.find();
    const totalTasks = tasks.length;

    const byPriority: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    let overdue = 0;
    let completedThisWeek = 0;
    let completedThisMonth = 0;

    for (const task of tasks) {
      byPriority[task.priority as TaskPriority]++;

      if (task.dueDate && new Date(task.dueDate) < now && !task.completed) {
        overdue++;
      }

      if (task.completedAt) {
        const completedDate = new Date(task.completedAt);
        if (completedDate >= weekAgo) completedThisWeek++;
        if (completedDate >= monthAgo) completedThisMonth++;
      }
    }

    // Work log statistics
    const workLogs = await this.workLogRepository.find({ relations: ['user'] });
    const totalHours = workLogs.reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);

    const hoursThisWeek = workLogs
      .filter((log) => new Date(log.workDate) >= weekAgo)
      .reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);

    const hoursThisMonth = workLogs
      .filter((log) => new Date(log.workDate) >= monthAgo)
      .reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);

    const hoursByUser = workLogs.reduce((acc, log) => {
      const userId = log.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          userName: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown',
          hours: 0,
        };
      }
      acc[userId].hours += parseFloat(log.timeSpent.toString());
      return acc;
    }, {} as Record<string, { userId: string; userName: string; hours: number }>);

    // Activity statistics
    const tasksCreatedThisWeek = tasks.filter((t) => new Date(t.createdAt) >= weekAgo).length;
    const tasksCompletedThisWeek = tasks.filter(
      (t) => t.completedAt && new Date(t.completedAt) >= weekAgo,
    ).length;

    const commentsAddedThisWeek = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.createdAt >= :weekAgo', { weekAgo })
      .getCount();

    const workLogsAddedThisWeek = workLogs.filter((log) => new Date(log.createdAt) >= weekAgo).length;

    return {
      tasks: {
        total: totalTasks,
        byPriority,
        overdue,
        completedThisWeek,
        completedThisMonth,
      },
      workLogs: {
        totalHours: Math.round(totalHours * 100) / 100,
        thisWeek: Math.round(hoursThisWeek * 100) / 100,
        thisMonth: Math.round(hoursThisMonth * 100) / 100,
        byUser: Object.values(hoursByUser).map((u) => ({
          ...u,
          hours: Math.round(u.hours * 100) / 100,
        })),
      },
      activity: {
        tasksCreated: tasksCreatedThisWeek,
        tasksCompleted: tasksCompletedThisWeek,
        commentsAdded: commentsAddedThisWeek,
        workLogsAdded: workLogsAddedThisWeek,
      },
    };
  }

  /**
   * Get time tracking report
   */
  async getTimeTrackingReport(startDate?: string, endDate?: string): Promise<TimeTrackingReport> {
    let workLogsQuery = this.workLogRepository.createQueryBuilder('workLog')
      .leftJoinAndSelect('workLog.task', 'task')
      .leftJoinAndSelect('workLog.user', 'user');

    if (startDate && endDate) {
      workLogsQuery = workLogsQuery.where('workLog.workDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const workLogs = await workLogsQuery.getMany();
    const totalHours = workLogs.reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);

    // Group by task
    const taskMap = new Map<string, { taskId: string; taskTitle: string; hours: number; estimated: number }>();
    for (const log of workLogs) {
      if (!log.task) continue;

      if (!taskMap.has(log.taskId)) {
        taskMap.set(log.taskId, {
          taskId: log.taskId,
          taskTitle: log.task.title,
          hours: 0,
          estimated: log.task.estimatedHours || 0,
        });
      }
      taskMap.get(log.taskId)!.hours += parseFloat(log.timeSpent.toString());
    }

    const byTask = Array.from(taskMap.values()).map((item) => ({
      ...item,
      hours: Math.round(item.hours * 100) / 100,
      percentage: item.estimated > 0 ? Math.round((item.hours / item.estimated) * 100) : 0,
    })).sort((a, b) => b.hours - a.hours);

    // Group by user
    const userMap = new Map<string, { userId: string; userName: string; hours: number; taskCount: Set<string> }>();
    for (const log of workLogs) {
      if (!log.user) continue;

      if (!userMap.has(log.userId)) {
        userMap.set(log.userId, {
          userId: log.userId,
          userName: `${log.user.firstName} ${log.user.lastName}`,
          hours: 0,
          taskCount: new Set(),
        });
      }
      const userEntry = userMap.get(log.userId)!;
      userEntry.hours += parseFloat(log.timeSpent.toString());
      userEntry.taskCount.add(log.taskId);
    }

    const byUser = Array.from(userMap.values()).map((item) => ({
      userId: item.userId,
      userName: item.userName,
      hours: Math.round(item.hours * 100) / 100,
      taskCount: item.taskCount.size,
    })).sort((a, b) => b.hours - a.hours);

    // Group by date
    const dateMap = new Map<string, { hours: number; entriesCount: number }>();
    for (const log of workLogs) {
      const dateStr = log.workDate.toString().split('T')[0];

      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { hours: 0, entriesCount: 0 });
      }
      const dateEntry = dateMap.get(dateStr)!;
      dateEntry.hours += parseFloat(log.timeSpent.toString());
      dateEntry.entriesCount++;
    }

    const byDate = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        hours: Math.round(data.hours * 100) / 100,
        entriesCount: data.entriesCount,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      byTask,
      byUser,
      byDate,
    };
  }

  /**
   * Get user productivity report
   */
  async getUserProductivityReport(userId?: string): Promise<UserProductivityReport[]> {
    const users = userId
      ? [await this.userRepository.findOne({ where: { id: userId } })]
      : await this.userRepository.find();

    const reports: UserProductivityReport[] = [];

    for (const user of users) {
      if (!user) continue;

      const tasks = await this.taskRepository.find({ where: { assigneeId: user.id } });
      const tasksAssigned = tasks.length;
      const tasksCompleted = tasks.filter((t) => t.completed).length;
      const completionRate = tasksAssigned > 0 ? Math.round((tasksCompleted / tasksAssigned) * 100) : 0;

      const workLogs = await this.workLogRepository.find({ where: { userId: user.id } });
      const hoursLogged = workLogs.reduce((sum, log) => sum + parseFloat(log.timeSpent.toString()), 0);

      const completedTasks = tasks.filter((t) => t.completedAt);
      let averageTaskDuration = 0;
      if (completedTasks.length > 0) {
        const totalDuration = completedTasks.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime();
          const completed = new Date(t.completedAt!).getTime();
          return sum + (completed - created);
        }, 0);
        averageTaskDuration = Math.round(totalDuration / completedTasks.length / (1000 * 60 * 60 * 24)); // days
      }

      const commentsAdded = await this.commentRepository.count({ where: { authorId: user.id } });

      reports.push({
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        tasksAssigned,
        tasksCompleted,
        completionRate,
        hoursLogged: Math.round(hoursLogged * 100) / 100,
        averageTaskDuration,
        commentsAdded,
      });
    }

    return reports.sort((a, b) => b.completionRate - a.completionRate);
  }

  /**
   * Get task distribution report
   */
  async getTaskDistributionReport(): Promise<TaskDistributionReport> {
    const tasks = await this.taskRepository.find({ relations: ['assignee'] });
    const total = tasks.length;

    // By priority
    const priorityCounts = new Map<TaskPriority, number>();
    const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
    for (const priority of priorities) {
      priorityCounts.set(priority, 0);
    }
    for (const task of tasks) {
      const priority = task.priority as TaskPriority;
      priorityCounts.set(priority, (priorityCounts.get(priority) || 0) + 1);
    }
    const byPriority = Array.from(priorityCounts.entries()).map(([priority, count]) => ({
      priority,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    // By assignee
    const assigneeCounts = new Map<string, { userId: string; userName: string; count: number }>();
    for (const task of tasks) {
      if (task.assigneeId) {
        if (!assigneeCounts.has(task.assigneeId)) {
          assigneeCounts.set(task.assigneeId, {
            userId: task.assigneeId,
            userName: task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : 'Unknown',
            count: 0,
          });
        }
        assigneeCounts.get(task.assigneeId)!.count++;
      }
    }
    const byAssignee = Array.from(assigneeCounts.values()).sort((a, b) => b.count - a.count);

    // By issue type
    const typeCounts = new Map<string, number>();
    for (const task of tasks) {
      const type = task.issueType || 'task';
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    }
    const byIssueType = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return {
      byPriority,
      byAssignee,
      byIssueType,
    };
  }

  /**
   * Get trend report
   */
  async getTrendReport(period: 'week' | 'month' | 'quarter'): Promise<TrendReport> {
    const now = new Date();
    let startDate: Date;
    let days: number;

    switch (period) {
      case 'week':
        days = 7;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        days = 30;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        days = 90;
        startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        break;
    }

    // Tasks created
    const tasks = await this.taskRepository.find();
    const tasksInPeriod = tasks.filter((t) => new Date(t.createdAt) >= startDate);

    const createdByDate = new Map<string, number>();
    for (const task of tasksInPeriod) {
      const dateStr = task.createdAt.toString().split('T')[0];
      createdByDate.set(dateStr, (createdByDate.get(dateStr) || 0) + 1);
    }

    // Tasks completed
    const completedByDate = new Map<string, number>();
    for (const task of tasks) {
      if (task.completedAt && new Date(task.completedAt) >= startDate) {
        const dateStr = task.completedAt.toString().split('T')[0];
        completedByDate.set(dateStr, (completedByDate.get(dateStr) || 0) + 1);
      }
    }

    // Hours logged
    const workLogs = await this.workLogRepository.find({
      where: {
        workDate: Between(startDate, now),
      },
    });

    const hoursByDate = new Map<string, number>();
    for (const log of workLogs) {
      const dateStr = log.workDate.toString().split('T')[0];
      hoursByDate.set(dateStr, (hoursByDate.get(dateStr) || 0) + parseFloat(log.timeSpent.toString()));
    }

    // Fill in all dates
    const allDates: string[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      allDates.push(date.toISOString().split('T')[0]);
    }

    const tasksCreated = allDates.map((date) => ({
      date,
      count: createdByDate.get(date) || 0,
    }));

    const tasksCompleted = allDates.map((date) => ({
      date,
      count: completedByDate.get(date) || 0,
    }));

    const hoursLogged = allDates.map((date) => ({
      date,
      hours: Math.round((hoursByDate.get(date) || 0) * 100) / 100,
    }));

    // Calculate velocity (tasks completed per day)
    const totalCompleted = Array.from(completedByDate.values()).reduce((a, b) => a + b, 0);
    const velocity = Math.round((totalCompleted / days) * 10) / 10;

    return {
      period,
      tasksCreated,
      tasksCompleted,
      hoursLogged,
      velocity,
    };
  }
}
