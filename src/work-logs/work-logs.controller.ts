import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WorkLogsService } from './work-logs.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { WorkLog } from './work-log.entity';

@Controller('work-logs')
export class WorkLogsController {
  constructor(private readonly workLogsService: WorkLogsService) {}

  /**
   * Create a new work log
   * POST /work-logs
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWorkLogDto: CreateWorkLogDto): Promise<WorkLog> {
    return this.workLogsService.create(createWorkLogDto);
  }

  /**
   * Get all work logs for a task
   * GET /work-logs?issueId=xxx
   */
  @Get()
  async findByIssue(@Query('issueId') issueId?: string, @Query('userId') userId?: string): Promise<WorkLog[]> {
    if (issueId) {
      return this.workLogsService.findByIssue(issueId);
    }
    if (userId) {
      return this.workLogsService.findByUser(userId);
    }
    return [];
  }

  /**
   * Get a single work log
   * GET /work-logs/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkLog> {
    return this.workLogsService.findOne(id);
  }

  /**
   * Update a work log
   * PUT /work-logs/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWorkLogDto: UpdateWorkLogDto,
    @Query('userId') userId: string,
  ): Promise<WorkLog> {
    return this.workLogsService.update(id, updateWorkLogDto, userId);
  }

  /**
   * Delete a work log
   * DELETE /work-logs/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Query('userId') userId: string): Promise<void> {
    return this.workLogsService.remove(id, userId);
  }

  /**
   * Get total time logged for a task
   * GET /work-logs/task/:issueId/total
   */
  @Get('task/:issueId/total')
  async getTotalTime(@Param('issueId') issueId: string): Promise<{ total: number }> {
    const total = await this.workLogsService.getTotalTimeByTask(issueId);
    return { total };
  }

  /**
   * Get time tracking summary for a task
   * GET /work-logs/task/:issueId/summary
   */
  @Get('task/:issueId/summary')
  async getTaskSummary(@Param('issueId') issueId: string) {
    return this.workLogsService.getTaskSummary(issueId);
  }
}
