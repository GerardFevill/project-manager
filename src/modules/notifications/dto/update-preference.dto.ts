import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsArray, IsBoolean, IsOptional } from 'class-validator';
import { NotificationChannel } from '../entities/notification.entity';

export class UpdatePreferenceDto {
  @ApiProperty({ enum: NotificationChannel, isArray: true, example: [NotificationChannel.IN_APP] })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  enabledChannels?: NotificationChannel[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
