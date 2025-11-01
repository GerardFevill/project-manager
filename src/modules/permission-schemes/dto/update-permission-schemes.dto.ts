import { PartialType } from '@nestjs/swagger';
import { CreatePermissionSchemeDto } from './create-permission-schemes.dto';

export class UpdatePermissionSchemeDto extends PartialType(CreatePermissionSchemeDto) {}
