import { PartialType } from '@nestjs/swagger';
import { CreateMobileSessionDto } from './create-mobile-api.dto';

export class UpdateMobileSessionDto extends PartialType(CreateMobileSessionDto) {}
