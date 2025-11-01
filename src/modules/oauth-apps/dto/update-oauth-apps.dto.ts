import { PartialType } from '@nestjs/swagger';
import { CreateOAuthAppDto } from './create-oauth-apps.dto';

export class UpdateOAuthAppDto extends PartialType(CreateOAuthAppDto) {}
