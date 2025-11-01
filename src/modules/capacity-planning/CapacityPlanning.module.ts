import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapacityPlan } from './entities/CapacityPlan.entity';
import { CapacityPlanningController } from './capacity-planning.controller';
import { CapacityPlanningService } from './capacity-planning.service';

@Module({
  imports: [TypeOrmModule.forFeature([CapacityPlan])],
  controllers: [CapacityPlanningController],
  providers: [CapacityPlanningService],
  exports: [CapacityPlanningService, TypeOrmModule],
})
export class CapacityPlanningModule {}
