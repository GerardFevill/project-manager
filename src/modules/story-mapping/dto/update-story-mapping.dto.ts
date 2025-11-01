import { PartialType } from '@nestjs/swagger';
import { CreateStoryMapDto } from './create-story-mapping.dto';

export class UpdateStoryMapDto extends PartialType(CreateStoryMapDto) {}
