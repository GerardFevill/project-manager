import { PartialType } from '@nestjs/swagger';
import { CreateScheduledJobDto } from './create-scheduled-jobs.dto';

export class UpdateScheduledJobDto extends PartialType(CreateScheduledJobDto) {}
