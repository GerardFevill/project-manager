import { PartialType } from '@nestjs/swagger';
import { CreateCloneOperationDto } from './create-project-cloning.dto';

export class UpdateCloneOperationDto extends PartialType(CreateCloneOperationDto) {}
