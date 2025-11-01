import { PartialType } from '@nestjs/swagger';
import { CreateServiceRequestDto } from './create-service-desk.dto';

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {}
