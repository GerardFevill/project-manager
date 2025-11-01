import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './entities/Prediction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction])],
  exports: [TypeOrmModule],
})
export class PredictiveAnalyticsModule {}
