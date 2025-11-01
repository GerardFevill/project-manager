import { PartialType } from '@nestjs/swagger';
import { CreateGdprLogDto } from './create-gdpr-compliance.dto';

export class UpdateGdprLogDto extends PartialType(CreateGdprLogDto) {}
