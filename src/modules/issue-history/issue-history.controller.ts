import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IssueHistoryService } from './issue-history.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('issue-history')
@Controller('issue-history')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssueHistoryController {
  constructor(private readonly historyService: IssueHistoryService) {}

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get issue history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns issue change history' })
  async getIssueHistory(
    @Param('issueId') issueId: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.historyService.getIssueHistory(issueId, limit || 100, offset || 0);
  }

  @Get('issue/:issueId/field/:fieldName')
  @ApiOperation({ summary: 'Get field change history' })
  @ApiResponse({ status: 200, description: 'Returns field change history' })
  async getFieldHistory(
    @Param('issueId') issueId: string,
    @Param('fieldName') fieldName: string,
  ) {
    return this.historyService.getFieldHistory(issueId, fieldName);
  }

  @Get('issue/:issueId/stats')
  @ApiOperation({ summary: 'Get issue history statistics' })
  @ApiResponse({ status: 200, description: 'Returns history statistics' })
  async getHistoryStats(@Param('issueId') issueId: string) {
    return this.historyService.getHistoryStats(issueId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user activity history' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns user activity' })
  async getUserActivity(
    @Param('userId') userId: string,
    @Query('limit') limit?: number,
  ) {
    return this.historyService.getUserActivity(userId, limit || 50);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent changes' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Returns recent changes' })
  async getRecentChanges(
    @Query('projectId') projectId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.historyService.getRecentChanges(projectId, limit || 50);
  }
}
