import { PartialType } from '@nestjs/swagger';
import { CreateScreenSchemeDto } from './create-screen-schemes.dto';

export class UpdateScreenSchemeDto extends PartialType(CreateScreenSchemeDto) {}
