import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('issues')
@Controller('issues')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all issues with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of issues' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('projectId') projectId?: string,
  ) {
    return this.issuesService.findAll(Number(page), Number(limit), projectId);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Get all issues for a project' })
  @ApiResponse({ status: 200, description: 'Returns list of issues for the project' })
  async findByProject(@Param('projectId') projectId: string) {
    return this.issuesService.findByProject(projectId);
  }

  @Get('assignee/:assigneeId')
  @ApiOperation({ summary: 'Get all issues assigned to a user' })
  @ApiResponse({ status: 200, description: 'Returns list of issues assigned to the user' })
  async findByAssignee(@Param('assigneeId') assigneeId: string) {
    return this.issuesService.findByAssignee(assigneeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get issue by ID' })
  @ApiResponse({ status: 200, description: 'Returns issue details' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get issue by key' })
  @ApiResponse({ status: 200, description: 'Returns issue details' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async findByKey(@Param('key') key: string) {
    return this.issuesService.findByKey(key);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  @ApiResponse({ status: 201, description: 'Issue successfully created' })
  @ApiResponse({ status: 400, description: 'Project not found' })
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update issue by ID' })
  @ApiResponse({ status: 200, description: 'Issue successfully updated' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete issue by ID' })
  @ApiResponse({ status: 204, description: 'Issue successfully deleted' })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }
}
