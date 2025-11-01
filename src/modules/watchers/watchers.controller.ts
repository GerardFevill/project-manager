import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { WatchersService } from './watchers.service';
import { CreateWatcherDto } from './dto/create-watcher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('watchers')
@Controller('watchers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WatchersController {
  constructor(private readonly watchersService: WatchersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all watchers' })
  @ApiQuery({ name: 'issueId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns list of watchers' })
  async findAll(@Query('issueId') issueId?: string) {
    return this.watchersService.findAll(issueId);
  }

  @Get('issue/:issueId')
  @ApiOperation({ summary: 'Get all watchers for an issue' })
  @ApiResponse({ status: 200, description: 'Returns list of watchers for the issue' })
  async findByIssue(@Param('issueId') issueId: string) {
    return this.watchersService.findByIssue(issueId);
  }

  @Get('user/me')
  @ApiOperation({ summary: 'Get all issues the current user is watching' })
  @ApiResponse({ status: 200, description: 'Returns list of watched issues' })
  async findMyWatched(@CurrentUser() user: any) {
    return this.watchersService.findByUser(user.userId);
  }

  @Get('issue/:issueId/is-watching')
  @ApiOperation({ summary: 'Check if current user is watching an issue' })
  @ApiResponse({ status: 200, description: 'Returns watching status' })
  async isWatching(@Param('issueId') issueId: string, @CurrentUser() user: any) {
    const watching = await this.watchersService.isWatching(issueId, user.userId);
    return { watching };
  }

  @Post('watch')
  @ApiOperation({ summary: 'Watch an issue' })
  @ApiResponse({ status: 201, description: 'Successfully watching the issue' })
  @ApiResponse({ status: 409, description: 'Already watching this issue' })
  async watch(@Body() createWatcherDto: CreateWatcherDto, @CurrentUser() user: any) {
    return this.watchersService.watch(createWatcherDto, user.userId);
  }

  @Delete('issue/:issueId/unwatch')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unwatch an issue' })
  @ApiResponse({ status: 204, description: 'Successfully unwatched the issue' })
  @ApiResponse({ status: 404, description: 'Not watching this issue' })
  async unwatch(@Param('issueId') issueId: string, @CurrentUser() user: any) {
    return this.watchersService.unwatch(issueId, user.userId);
  }
}
