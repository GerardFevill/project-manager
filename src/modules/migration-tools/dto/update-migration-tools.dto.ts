import { PartialType } from '@nestjs/swagger';
import { CreateMigrationDto } from './create-migration-tools.dto';

export class UpdateMigrationDto extends PartialType(CreateMigrationDto) {}
