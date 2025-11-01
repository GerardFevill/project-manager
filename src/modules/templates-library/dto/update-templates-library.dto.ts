import { PartialType } from '@nestjs/swagger';
import { CreateProjectTemplateDto } from './create-templates-library.dto';

export class UpdateProjectTemplateDto extends PartialType(CreateProjectTemplateDto) {}
