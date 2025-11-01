import { PartialType } from '@nestjs/swagger';
import { CreateExecutiveDashboardDto } from './create-executive-dashboards.dto';

export class UpdateExecutiveDashboardDto extends PartialType(CreateExecutiveDashboardDto) {}
