import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationPreference } from './entities/notification-preference.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationPreference)
    private readonly preferenceRepository: Repository<NotificationPreference>,
  ) {}

  // Notifications Management
  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Check user preferences before creating
    const preference = await this.getUserPreference(
      createNotificationDto.userId,
      createNotificationDto.type,
    );

    let channels = createNotificationDto.channels;
    if (preference && !preference.isEnabled) {
      return null; // Don't create notification if disabled
    }

    if (preference && preference.enabledChannels.length > 0) {
      // Filter channels based on user preferences
      channels = channels.filter(channel => preference.enabledChannels.includes(channel));
    }

    if (channels.length === 0) {
      return null; // No channels enabled
    }

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      channels,
      createdAt: new Date(),
    });

    return this.notificationRepository.save(notification);
  }

  async findUserNotifications(
    userId: string,
    unreadOnly: boolean = false,
  ): Promise<Notification[]> {
    const query: any = { userId };

    if (unreadOnly) {
      query.isRead = false;
    }

    return this.notificationRepository.find({
      where: query,
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user', 'actor'],
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);

    notification.isRead = true;
    notification.readAt = new Date();

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }

  async deleteNotification(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationRepository.remove(notification);
  }

  async deleteAllUserNotifications(userId: string): Promise<void> {
    await this.notificationRepository.delete({ userId });
  }

  // User Preferences Management
  async getUserPreference(
    userId: string,
    notificationType: NotificationType,
  ): Promise<NotificationPreference | null> {
    return this.preferenceRepository.findOne({
      where: { userId, notificationType },
    });
  }

  async getUserPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.preferenceRepository.find({
      where: { userId },
      order: { notificationType: 'ASC' },
    });
  }

  async updatePreference(
    userId: string,
    notificationType: NotificationType,
    updatePreferenceDto: UpdatePreferenceDto,
  ): Promise<NotificationPreference> {
    let preference = await this.getUserPreference(userId, notificationType);

    if (!preference) {
      // Create default preference
      preference = this.preferenceRepository.create({
        userId,
        notificationType,
        enabledChannels: updatePreferenceDto.enabledChannels || [],
        isEnabled: updatePreferenceDto.isEnabled ?? true,
        createdAt: new Date(),
      });
    } else {
      Object.assign(preference, updatePreferenceDto);
    }

    preference.updatedAt = new Date();

    return this.preferenceRepository.save(preference);
  }

  async resetPreferences(userId: string): Promise<void> {
    await this.preferenceRepository.delete({ userId });
  }
}
