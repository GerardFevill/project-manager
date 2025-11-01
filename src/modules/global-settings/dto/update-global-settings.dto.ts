import { PartialType } from '@nestjs/swagger';
import { CreateGlobalSettingDto } from './create-global-settings.dto';

export class UpdateGlobalSettingDto extends PartialType(CreateGlobalSettingDto) {}
