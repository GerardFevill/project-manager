import { PartialType } from '@nestjs/swagger';
import { CreateCapacityPlanDto } from './create-capacity-planning.dto';

export class UpdateCapacityPlanDto extends PartialType(CreateCapacityPlanDto) {}
