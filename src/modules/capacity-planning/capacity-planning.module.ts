import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacityPlan } from './entities/capacity-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CapacityPlan])],
  exports: [TypeOrmModule],
})
export class CapacityPlanningModule {}
