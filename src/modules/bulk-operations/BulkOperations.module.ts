import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkOperation } from './entities/BulkOperation.entity';
import { BulkOperationsController } from './bulk-operations.controller';
import { BulkOperationsService } from './bulk-operations.service';

@Module({
  imports: [TypeOrmModule.forFeature([BulkOperation])],
  controllers: [BulkOperationsController],
  providers: [BulkOperationsService],
  exports: [BulkOperationsService, TypeOrmModule],
})
export class BulkOperationsModule {}
