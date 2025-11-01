import { PartialType } from '@nestjs/swagger';
import { CreateSmartNotificationDto } from './create-smart-notifications.dto';

export class UpdateSmartNotificationDto extends PartialType(CreateSmartNotificationDto) {}
