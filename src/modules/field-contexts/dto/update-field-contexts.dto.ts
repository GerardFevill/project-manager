import { PartialType } from '@nestjs/swagger';
import { CreateFieldContextDto } from './create-field-contexts.dto';

export class UpdateFieldContextDto extends PartialType(CreateFieldContextDto) {}
