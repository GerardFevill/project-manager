import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /reports/overview
   * Get comprehensive overview report with all key metrics
   */
  @Get('overview')
  async getOverviewReport() {
    return this.reportsService.getOverviewReport();
  }

  /**
   * GET /reports/time-tracking
   * Get time tracking report with breakdown by task, user, and date
   * Query params: startDate, endDate (YYYY-MM-DD format)
   */
  @Get('time-tracking')
  async getTimeTrackingReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getTimeTrackingReport(startDate, endDate);
  }

  /**
   * GET /reports/user-productivity
   * Get user productivity report
   * Query params: userId (optional, if not provided returns all users)
   */
  @Get('user-productivity')
  async getUserProductivityReport(@Query('userId') userId?: string) {
    return this.reportsService.getUserProductivityReport(userId);
  }

  /**
   * GET /reports/task-distribution
   * Get task distribution report by status, priority, assignee, and type
   */
  @Get('task-distribution')
  async getTaskDistributionReport() {
    return this.reportsService.getTaskDistributionReport();
  }

  /**
   * GET /reports/trends
   * Get trend report showing tasks created/completed and hours logged over time
   * Query params: period (week, month, quarter)
   */
  @Get('trends')
  async getTrendReport(@Query('period') period: 'week' | 'month' | 'quarter' = 'week') {
    return this.reportsService.getTrendReport(period);
  }
}
