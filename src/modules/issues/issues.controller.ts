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

  // ========== BULK OPERATIONS ==========

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple issues' })
  @ApiResponse({ status: 201 })
  async createBulk(@Body() dto: { issues: CreateIssueDto[] }) {
    return this.issuesService.createBulk(dto.issues);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Update multiple issues' })
  @ApiResponse({ status: 200 })
  async updateBulk(@Body() dto: { issueIds: string[]; updates: UpdateIssueDto }) {
    return this.issuesService.updateBulk(dto.issueIds, dto.updates);
  }

  // ========== ISSUE ACTIONS ==========

  @Post(':id/assignee')
  @ApiOperation({ summary: 'Assign issue to user' })
  @ApiResponse({ status: 200 })
  async assignIssue(@Param('id') id: string, @Body() dto: { assigneeId: string }) {
    return this.issuesService.assignIssue(id, dto.assigneeId);
  }

  @Post(':id/notify')
  @ApiOperation({ summary: 'Send notification for issue' })
  @ApiResponse({ status: 200 })
  async notifyIssue(@Param('id') id: string, @Body() dto: { userIds: string[]; message?: string }) {
    return this.issuesService.notifyIssue(id, dto.userIds, dto.message);
  }

  @Post(':id/move')
  @ApiOperation({ summary: 'Move issue to another project' })
  @ApiResponse({ status: 200 })
  async moveIssue(@Param('id') id: string, @Body() dto: { targetProjectId: string }) {
    return this.issuesService.moveIssue(id, dto.targetProjectId);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone an issue' })
  @ApiResponse({ status: 201 })
  async cloneIssue(@Param('id') id: string, @Body() dto: { summary?: string; projectId?: string }) {
    return this.issuesService.cloneIssue(id, dto.summary, dto.projectId);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive issue' })
  @ApiResponse({ status: 200 })
  async archiveIssue(@Param('id') id: string) {
    return this.issuesService.archiveIssue(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore archived issue' })
  @ApiResponse({ status: 200 })
  async restoreIssue(@Param('id') id: string) {
    return this.issuesService.restoreIssue(id);
  }

  // ========== SUBTASKS ==========

  @Get(':id/subtasks')
  @ApiOperation({ summary: 'Get all subtasks of an issue' })
  @ApiResponse({ status: 200 })
  async getSubtasks(@Param('id') id: string) {
    return this.issuesService.getSubtasks(id);
  }

  @Post(':id/subtasks')
  @ApiOperation({ summary: 'Create subtask' })
  @ApiResponse({ status: 201 })
  async createSubtask(@Param('id') id: string, @Body() dto: CreateIssueDto) {
    return this.issuesService.createSubtask(id, dto);
  }

  // ========== REMOTE LINKS ==========

  @Get(':id/remotelinks')
  @ApiOperation({ summary: 'Get remote links for issue' })
  @ApiResponse({ status: 200 })
  async getRemoteLinks(@Param('id') id: string) {
    return this.issuesService.getRemoteLinks(id);
  }

  @Post(':id/remotelinks')
  @ApiOperation({ summary: 'Add remote link to issue' })
  @ApiResponse({ status: 201 })
  async addRemoteLink(@Param('id') id: string, @Body() dto: { url: string; title: string }) {
    return this.issuesService.addRemoteLink(id, dto.url, dto.title);
  }

  @Delete(':id/remotelinks/:linkId')
  @ApiOperation({ summary: 'Remove remote link from issue' })
  @ApiResponse({ status: 204 })
  async removeRemoteLink(@Param('id') id: string, @Param('linkId') linkId: string) {
    return this.issuesService.removeRemoteLink(id, linkId);
  }

  // ========== METADATA ==========

  @Get(':id/editmeta')
  @ApiOperation({ summary: 'Get edit metadata for issue' })
  @ApiResponse({ status: 200 })
  async getEditMeta(@Param('id') id: string) {
    return this.issuesService.getEditMeta(id);
  }

  @Get('createmeta')
  @ApiOperation({ summary: 'Get create metadata for issues' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiResponse({ status: 200 })
  async getCreateMeta(@Query('projectId') projectId?: string) {
    return this.issuesService.getCreateMeta(projectId);
  }

  @Get('picker/suggestions')
  @ApiOperation({ summary: 'Get issue picker suggestions' })
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'currentIssueKey', required: false })
  @ApiResponse({ status: 200 })
  async getPickerSuggestions(
    @Query('query') query: string,
    @Query('currentIssueKey') currentIssueKey?: string,
  ) {
    return this.issuesService.getPickerSuggestions(query, currentIssueKey);
  }
}
