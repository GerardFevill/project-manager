import { PartialType } from '@nestjs/swagger';
import { CreateSecurityLevelDto } from './create-security-levels.dto';

export class UpdateSecurityLevelDto extends PartialType(CreateSecurityLevelDto) {}
