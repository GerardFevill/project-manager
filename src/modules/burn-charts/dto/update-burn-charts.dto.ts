import { PartialType } from '@nestjs/swagger';
import { CreateBurnDataDto } from './create-burn-charts.dto';

export class UpdateBurnDataDto extends PartialType(CreateBurnDataDto) {}
