import { PartialType } from '@nestjs/swagger';
import { CreateBulkOperationDto } from './create-bulk-operations.dto';

export class UpdateBulkOperationDto extends PartialType(CreateBulkOperationDto) {}
