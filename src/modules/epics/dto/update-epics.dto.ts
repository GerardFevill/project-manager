import { PartialType } from '@nestjs/swagger';
import { CreateEpicDto } from './create-epics.dto';

export class UpdateEpicDto extends PartialType(CreateEpicDto) {}
