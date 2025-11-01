import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataRetention } from './entities/DataRetention.entity';
import { DataRetentionController } from './data-retention.controller';
import { DataRetentionService } from './data-retention.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataRetention])],
  controllers: [DataRetentionController],
  providers: [DataRetentionService],
  exports: [DataRetentionService, TypeOrmModule],
})
export class DataRetentionModule {}
