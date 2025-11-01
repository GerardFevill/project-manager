import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationType } from './entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Notifications
  @Post()
  @ApiOperation({ summary: 'Create a notification' })
  @ApiResponse({ status: 201, description: 'Notification successfully created' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Returns user notifications' })
  async getMyNotifications(
    @Request() req,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.notificationsService.findUserNotifications(
      req.user.userId,
      unreadOnly === true || unreadOnly === 'true',
    );
  }

  @Get('me/unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Returns unread count' })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Put('me/mark-all-read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 204, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete all my notifications' })
  @ApiResponse({ status: 204, description: 'All notifications deleted' })
  async deleteAll(@Request() req) {
    await this.notificationsService.deleteAllUserNotifications(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Returns notification details' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification by ID' })
  @ApiResponse({ status: 204, description: 'Notification successfully deleted' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async remove(@Param('id') id: string) {
    await this.notificationsService.deleteNotification(id);
  }

  // User Preferences
  @Get('preferences/me')
  @ApiOperation({ summary: 'Get my notification preferences' })
  @ApiResponse({ status: 200, description: 'Returns notification preferences' })
  async getMyPreferences(@Request() req) {
    return this.notificationsService.getUserPreferences(req.user.userId);
  }

  @Put('preferences/:type')
  @ApiOperation({ summary: 'Update notification preference' })
  @ApiResponse({ status: 200, description: 'Preference successfully updated' })
  async updatePreference(
    @Request() req,
    @Param('type') type: NotificationType,
    @Body() updatePreferenceDto: UpdatePreferenceDto,
  ) {
    return this.notificationsService.updatePreference(
      req.user.userId,
      type,
      updatePreferenceDto,
    );
  }

  @Delete('preferences/me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reset all notification preferences to default' })
  @ApiResponse({ status: 204, description: 'Preferences reset successfully' })
  async resetPreferences(@Request() req) {
    await this.notificationsService.resetPreferences(req.user.userId);
  }
}
