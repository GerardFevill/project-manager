import { PartialType } from '@nestjs/swagger';
import { CreateMarketplaceAppDto } from './create-marketplace-apps.dto';

export class UpdateMarketplaceAppDto extends PartialType(CreateMarketplaceAppDto) {}
