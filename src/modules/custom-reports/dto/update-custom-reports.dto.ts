import { PartialType } from '@nestjs/swagger';
import { CreateCustomReportDto } from './create-custom-reports.dto';

export class UpdateCustomReportDto extends PartialType(CreateCustomReportDto) {}
