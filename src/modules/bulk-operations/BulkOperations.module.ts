import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkOperation } from './entities/BulkOperation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BulkOperation])],
  exports: [TypeOrmModule],
})
export class BulkOperationsModule {}
