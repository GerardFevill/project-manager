import { PartialType } from '@nestjs/swagger';
import { CreateFieldConfigurationDto } from './create-field-configurations.dto';

export class UpdateFieldConfigurationDto extends PartialType(CreateFieldConfigurationDto) {}
