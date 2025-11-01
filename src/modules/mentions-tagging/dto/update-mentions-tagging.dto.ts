import { PartialType } from '@nestjs/swagger';
import { CreateMentionDto } from './create-mentions-tagging.dto';

export class UpdateMentionDto extends PartialType(CreateMentionDto) {}
