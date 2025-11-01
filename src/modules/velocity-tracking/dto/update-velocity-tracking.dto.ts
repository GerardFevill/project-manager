import { PartialType } from '@nestjs/swagger';
import { CreateVelocityDto } from './create-velocity-tracking.dto';

export class UpdateVelocityDto extends PartialType(CreateVelocityDto) {}
