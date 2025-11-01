import { PartialType } from '@nestjs/swagger';
import { CreateAssignmentRuleDto } from './create-auto-assignment.dto';

export class UpdateAssignmentRuleDto extends PartialType(CreateAssignmentRuleDto) {}
