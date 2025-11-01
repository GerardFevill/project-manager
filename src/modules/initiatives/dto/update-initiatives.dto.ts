import { PartialType } from '@nestjs/swagger';
import { CreateInitiativeDto } from './create-initiatives.dto';

export class UpdateInitiativeDto extends PartialType(CreateInitiativeDto) {}
