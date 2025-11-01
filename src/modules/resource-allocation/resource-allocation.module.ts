import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceAllocation } from './entities/resource-allocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceAllocation])],
  exports: [TypeOrmModule],
})
export class ResourceAllocationModule {}
