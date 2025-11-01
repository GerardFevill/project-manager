import { PartialType } from '@nestjs/swagger';
import { CreateAssetDto } from './create-asset-management.dto';

export class UpdateAssetDto extends PartialType(CreateAssetDto) {}
