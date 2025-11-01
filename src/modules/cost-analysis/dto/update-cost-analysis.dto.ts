import { PartialType } from '@nestjs/swagger';
import { CreateCostAnalysisDto } from './create-cost-analysis.dto';

export class UpdateCostAnalysisDto extends PartialType(CreateCostAnalysisDto) {}
