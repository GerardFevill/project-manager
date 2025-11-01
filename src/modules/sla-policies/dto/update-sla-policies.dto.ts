import { PartialType } from '@nestjs/swagger';
import { CreateSlaPolicyDto } from './create-sla-policies.dto';

export class UpdateSlaPolicyDto extends PartialType(CreateSlaPolicyDto) {}
