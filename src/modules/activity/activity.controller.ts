import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('activity')
@Controller('activity')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiQuery({ name: 'issueId', required: false, type: String })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of activities' })
  async findAll(
    @Query('issueId') issueId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.activityService.findAll(issueId, userId);
  }

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get activity history for an issue' })
  @ApiResponse({ status: 200, description: 'Returns activity history' })
  async findByIssue(@Param('issueId') issueId: string) {
    return this.activityService.getIssueHistory(issueId);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get current user activity' })
  @ApiResponse({ status: 200, description: 'Returns user activity' })
  async findMyActivity(@CurrentUser() user: any) {
    return this.activityService.findByUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({ status: 200, description: 'Returns activity details' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create activity log' })
  @ApiResponse({ status: 201, description: 'Activity successfully created' })
  async create(@Body() createActivityDto: CreateActivityDto, @CurrentUser() user: any) {
    return this.activityService.create(createActivityDto, user.userId);
  }
}
