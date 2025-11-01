import { PartialType } from '@nestjs/swagger';
import { CreateNotificationSchemeDto } from './create-notification-schemes.dto';

export class UpdateNotificationSchemeDto extends PartialType(CreateNotificationSchemeDto) {}
