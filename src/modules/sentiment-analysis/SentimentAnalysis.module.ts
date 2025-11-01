import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentLog } from './entities/SentimentLog.entity';
import { SentimentAnalysisController } from './sentiment-analysis.controller';
import { SentimentAnalysisService } from './sentiment-analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([SentimentLog])],
  controllers: [SentimentAnalysisController],
  providers: [SentimentAnalysisService],
  exports: [SentimentAnalysisService, TypeOrmModule],
})
export class SentimentAnalysisModule {}
