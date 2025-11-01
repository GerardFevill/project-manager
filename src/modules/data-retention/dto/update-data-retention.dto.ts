import { PartialType } from '@nestjs/swagger';
import { CreateDataRetentionDto } from './create-data-retention.dto';

export class UpdateDataRetentionDto extends PartialType(CreateDataRetentionDto) {}
