import { PartialType } from '@nestjs/swagger';
import { CreateCodeCommitDto } from './create-code-integration.dto';

export class UpdateCodeCommitDto extends PartialType(CreateCodeCommitDto) {}
