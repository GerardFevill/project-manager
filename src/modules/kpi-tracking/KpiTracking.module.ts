import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiMetric } from './entities/KpiMetric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KpiMetric])],
  exports: [TypeOrmModule],
})
export class KpiTrackingModule {}
