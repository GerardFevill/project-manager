import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BurnData } from './entities/BurnData.entity';
import { BurnChartsController } from './burn-charts.controller';
import { BurnChartsService } from './burn-charts.service';

@Module({
  imports: [TypeOrmModule.forFeature([BurnData])],
  controllers: [BurnChartsController],
  providers: [BurnChartsService],
  exports: [BurnChartsService, TypeOrmModule],
})
export class BurnChartsModule {}
