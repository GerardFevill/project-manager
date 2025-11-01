import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsMetric } from './entities/AnalyticsMetric.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsMetric])],
  exports: [TypeOrmModule],
})
export class AnalyticsEngineModule {}
