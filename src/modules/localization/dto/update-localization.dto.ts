import { PartialType } from '@nestjs/swagger';
import { CreateTranslationDto } from './create-localization.dto';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {}
