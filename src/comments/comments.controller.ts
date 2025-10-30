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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Create a new comment
   * POST /comments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentsService.create(createCommentDto);
  }

  /**
   * Get all comments for a task
   * GET /comments?taskId=xxx
   */
  @Get()
  async findByTask(@Query('taskId') taskId: string): Promise<Comment[]> {
    return this.commentsService.findByTask(taskId);
  }

  /**
   * Get a single comment
   * GET /comments/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentsService.findOne(id);
  }

  /**
   * Update a comment
   * PUT /comments/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Query('userId') userId: string, // In real app, get from auth token
  ): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto, userId);
  }

  /**
   * Delete a comment
   * DELETE /comments/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('userId') userId: string, // In real app, get from auth token
  ): Promise<void> {
    return this.commentsService.remove(id, userId);
  }

  /**
   * Get comment count for a task
   * GET /comments/count?taskId=xxx
   */
  @Get('count/task')
  async countByTask(@Query('taskId') taskId: string): Promise<{ count: number }> {
    const count = await this.commentsService.countByTask(taskId);
    return { count };
  }
}
