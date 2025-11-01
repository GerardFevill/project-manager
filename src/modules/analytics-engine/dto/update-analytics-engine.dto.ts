import { PartialType } from '@nestjs/swagger';
import { CreateAnalyticsMetricDto } from './create-analytics-engine.dto';

export class UpdateAnalyticsMetricDto extends PartialType(CreateAnalyticsMetricDto) {}
