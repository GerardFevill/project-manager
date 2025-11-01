import { PartialType } from '@nestjs/swagger';
import { CreateRetrospectiveDto } from './create-retrospectives.dto';

export class UpdateRetrospectiveDto extends PartialType(CreateRetrospectiveDto) {}
