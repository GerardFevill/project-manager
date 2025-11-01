import { PartialType } from '@nestjs/swagger';
import { CreateCumulativeFlowDto } from './create-cumulative-flow.dto';

export class UpdateCumulativeFlowDto extends PartialType(CreateCumulativeFlowDto) {}
