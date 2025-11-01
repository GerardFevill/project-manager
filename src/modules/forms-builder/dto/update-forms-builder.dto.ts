import { PartialType } from '@nestjs/swagger';
import { CreateFormTemplateDto } from './create-forms-builder.dto';

export class UpdateFormTemplateDto extends PartialType(CreateFormTemplateDto) {}
