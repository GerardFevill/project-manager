import { PartialType } from '@nestjs/swagger';
import { CreateConfluencePageDto } from './create-confluence-integration.dto';

export class UpdateConfluencePageDto extends PartialType(CreateConfluencePageDto) {}
