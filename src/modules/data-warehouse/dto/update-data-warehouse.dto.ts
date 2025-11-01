import { PartialType } from '@nestjs/swagger';
import { CreateDataWarehouseDto } from './create-data-warehouse.dto';

export class UpdateDataWarehouseDto extends PartialType(CreateDataWarehouseDto) {}
