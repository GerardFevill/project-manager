import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KpiMetric } from './entities/KpiMetric.entity';
import { KpiTrackingController } from './kpi-tracking.controller';
import { KpiTrackingService } from './kpi-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([KpiMetric])],
  controllers: [KpiTrackingController],
  providers: [KpiTrackingService],
  exports: [KpiTrackingService, TypeOrmModule],
})
export class KpiTrackingModule {}
