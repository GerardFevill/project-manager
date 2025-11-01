import { PartialType } from '@nestjs/swagger';
import { CreateRoadmapDto } from './create-roadmaps.dto';

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {}
