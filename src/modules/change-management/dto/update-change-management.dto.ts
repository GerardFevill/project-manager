import { PartialType } from '@nestjs/swagger';
import { CreateChangeRequestDto } from './create-change-management.dto';

export class UpdateChangeRequestDto extends PartialType(CreateChangeRequestDto) {}
