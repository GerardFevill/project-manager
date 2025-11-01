import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostAnalysis } from './entities/CostAnalysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CostAnalysis])],
  exports: [TypeOrmModule],
})
export class CostAnalysisModule {}
