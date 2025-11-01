import { PartialType } from '@nestjs/swagger';
import { CreateReleaseDto } from './create-release-management.dto';

export class UpdateReleaseDto extends PartialType(CreateReleaseDto) {}
