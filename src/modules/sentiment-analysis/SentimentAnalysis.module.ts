import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentLog } from './entities/SentimentLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SentimentLog])],
  exports: [TypeOrmModule],
})
export class SentimentAnalysisModule {}
