import { PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident-management.dto';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {}
