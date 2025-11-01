import { PartialType } from '@nestjs/swagger';
import { CreateReportTemplateDto } from './create-report-templates.dto';

export class UpdateReportTemplateDto extends PartialType(CreateReportTemplateDto) {}
