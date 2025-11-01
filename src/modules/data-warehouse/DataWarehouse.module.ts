import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataWarehouse } from './entities/DataWarehouse.entity';
import { DataWarehouseController } from './data-warehouse.controller';
import { DataWarehouseService } from './data-warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataWarehouse])],
  controllers: [DataWarehouseController],
  providers: [DataWarehouseService],
  exports: [DataWarehouseService, TypeOrmModule],
})
export class DataWarehouseModule {}
