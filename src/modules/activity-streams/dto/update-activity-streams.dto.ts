import { PartialType } from '@nestjs/swagger';
import { CreateActivityStreamDto } from './create-activity-streams.dto';

export class UpdateActivityStreamDto extends PartialType(CreateActivityStreamDto) {}
