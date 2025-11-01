import { PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget-tracking.dto';

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}
