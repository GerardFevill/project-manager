import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/Prediction.entity';
import { PredictiveAnalyticsController } from './predictive-analytics.controller';
import { PredictiveAnalyticsService } from './predictive-analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction])],
  controllers: [PredictiveAnalyticsController],
  providers: [PredictiveAnalyticsService],
  exports: [PredictiveAnalyticsService, TypeOrmModule],
})
export class PredictiveAnalyticsModule {}
