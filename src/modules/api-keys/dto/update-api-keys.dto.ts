import { PartialType } from '@nestjs/swagger';
import { CreateApiKeyDto } from './create-api-keys.dto';

export class UpdateApiKeyDto extends PartialType(CreateApiKeyDto) {}
