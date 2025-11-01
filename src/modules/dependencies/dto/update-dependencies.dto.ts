import { PartialType } from '@nestjs/swagger';
import { CreateDependencyDto } from './create-dependencies.dto';

export class UpdateDependencyDto extends PartialType(CreateDependencyDto) {}
