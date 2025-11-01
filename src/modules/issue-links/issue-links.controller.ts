import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IssueLinksService } from './issue-links.service';
import { CreateIssueLinkDto } from './dto/create-issue-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('issue-links')
@Controller('issue-links')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IssueLinksController {
  constructor(private readonly issueLinksService: IssueLinksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all issue links' })
  @ApiQuery({ name: 'issueId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of issue links' })
  async findAll(@Query('issueId') issueId?: string) {
    return this.issueLinksService.findAll(issueId);
  }

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get all links for an issue' })
  @ApiResponse({ status: 200, description: 'Returns outbound and inbound links' })
  async findByIssue(@Param('issueId') issueId: string) {
    return this.issueLinksService.findByIssue(issueId);
  }

  @Get('issue/:issueId/blocked')
  @ApiOperation({ summary: 'Get issues blocked by this issue' })
  @ApiResponse({ status: 200, description: 'Returns blocked issues' })
  async findBlockedIssues(@Param('issueId') issueId: string) {
    return this.issueLinksService.findBlockedIssues(issueId);
  }

  @Get('issue/:issueId/blocking')
  @ApiOperation({ summary: 'Get issues blocking this issue' })
  @ApiResponse({ status: 200, description: 'Returns blocking issues' })
  async findBlockingIssues(@Param('issueId') issueId: string) {
    return this.issueLinksService.findBlockingIssues(issueId);
  }

  @Get('issue/:issueId/related')
  @ApiOperation({ summary: 'Get related issues' })
  @ApiResponse({ status: 200, description: 'Returns related issues' })
  async findRelatedIssues(@Param('issueId') issueId: string) {
    return this.issueLinksService.findRelatedIssues(issueId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get issue link by ID' })
  @ApiResponse({ status: 200, description: 'Returns link details' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async findOne(@Param('id') id: string) {
    return this.issueLinksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new issue link' })
  @ApiResponse({ status: 201, description: 'Link successfully created' })
  @ApiResponse({ status: 400, description: 'Cannot link issue to itself' })
  @ApiResponse({ status: 409, description: 'Link already exists' })
  async create(@Body() createIssueLinkDto: CreateIssueLinkDto, @CurrentUser() user: any) {
    return this.issueLinksService.create(createIssueLinkDto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete issue link by ID' })
  @ApiResponse({ status: 204, description: 'Link successfully deleted' })
  @ApiResponse({ status: 404, description: 'Link not found' })
  async remove(@Param('id') id: string) {
    return this.issueLinksService.remove(id);
  }
}
