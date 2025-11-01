import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TimeReportsService } from './time-reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('time-reports')
@Controller('time-reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeReportsController {
  constructor(private readonly reportsService: TimeReportsService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user time tracking report' })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  @ApiResponse({ status: 200, description: 'Returns user time report' })
  async getUserReport(
    @Param('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getUserTimeReport(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get project time tracking report' })
  @ApiQuery({ name: 'startDate', type: String })
  @ApiQuery({ name: 'endDate', type: String })
  @ApiResponse({ status: 200, description: 'Returns project time report' })
  async getProjectReport(
    @Param('projectId') projectId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getProjectTimeReport(
      projectId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
