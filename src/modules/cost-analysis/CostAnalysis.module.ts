import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostAnalysis } from './entities/CostAnalysis.entity';
import { CostAnalysisController } from './cost-analysis.controller';
import { CostAnalysisService } from './cost-analysis.service';

@Module({
  imports: [TypeOrmModule.forFeature([CostAnalysis])],
  controllers: [CostAnalysisController],
  providers: [CostAnalysisService],
  exports: [CostAnalysisService, TypeOrmModule],
})
export class CostAnalysisModule {}
