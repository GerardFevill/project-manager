import { PartialType } from '@nestjs/swagger';
import { CreateSprintReportDto } from './create-sprint-reports.dto';

export class UpdateSprintReportDto extends PartialType(CreateSprintReportDto) {}
