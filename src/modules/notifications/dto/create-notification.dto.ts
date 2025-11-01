import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType, example: NotificationType.ISSUE_ASSIGNED })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: 'Issue assigned to you' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'You have been assigned to PROJ-123' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ example: 'issue', required: false })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiProperty({ example: '456' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '789', required: false })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiProperty({ enum: NotificationChannel, isArray: true, example: [NotificationChannel.IN_APP, NotificationChannel.EMAIL] })
  @IsEnum(NotificationChannel, { each: true })
  channels: NotificationChannel[];

  @ApiProperty({ example: { projectKey: 'PROJ' }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
