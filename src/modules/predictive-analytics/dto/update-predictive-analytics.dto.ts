import { PartialType } from '@nestjs/swagger';
import { CreatePredictionDto } from './create-predictive-analytics.dto';

export class UpdatePredictionDto extends PartialType(CreatePredictionDto) {}
