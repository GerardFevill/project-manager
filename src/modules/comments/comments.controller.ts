import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiQuery({ name: 'issueId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of comments' })
  async findAll(@Query('issueId') issueId?: string) {
    return this.commentsService.findAll(issueId);
  }

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get all comments for an issue' })
  @ApiResponse({ status: 200, description: 'Returns list of comments for the issue' })
  async findByIssue(@Param('issueId') issueId: string) {
    return this.commentsService.findByIssue(issueId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Returns comment details' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({ status: 200, description: 'Returns list of replies' })
  async findReplies(@Param('id') id: string) {
    return this.commentsService.findReplies(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  async create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentsService.create(createCommentDto, user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - not comment author' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.update(id, updateCommentDto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete comment by ID' })
  @ApiResponse({ status: 204, description: 'Comment successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - not comment author' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentsService.remove(id, user.userId);
  }
}
