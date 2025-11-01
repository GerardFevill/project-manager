import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsMetric } from './entities/AnalyticsMetric.entity';
import { AnalyticsEngineController } from './analytics-engine.controller';
import { AnalyticsEngineService } from './analytics-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsMetric])],
  controllers: [AnalyticsEngineController],
  providers: [AnalyticsEngineService],
  exports: [AnalyticsEngineService, TypeOrmModule],
})
export class AnalyticsEngineModule {}
