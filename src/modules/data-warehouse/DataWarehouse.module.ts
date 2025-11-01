import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataWarehouse } from './entities/DataWarehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataWarehouse])],
  exports: [TypeOrmModule],
})
export class DataWarehouseModule {}
