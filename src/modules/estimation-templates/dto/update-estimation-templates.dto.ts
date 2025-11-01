import { PartialType } from '@nestjs/swagger';
import { CreateEstimationTemplateDto } from './create-estimation-templates.dto';

export class UpdateEstimationTemplateDto extends PartialType(CreateEstimationTemplateDto) {}
