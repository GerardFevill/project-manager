import { PartialType } from '@nestjs/swagger';
import { CreateKpiMetricDto } from './create-kpi-tracking.dto';

export class UpdateKpiMetricDto extends PartialType(CreateKpiMetricDto) {}
