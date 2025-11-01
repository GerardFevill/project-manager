import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataRetention } from './entities/DataRetention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataRetention])],
  exports: [TypeOrmModule],
})
export class DataRetentionModule {}
