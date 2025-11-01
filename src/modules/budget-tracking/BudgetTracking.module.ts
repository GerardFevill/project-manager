import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/Budget.entity';
import { BudgetTrackingController } from './budget-tracking.controller';
import { BudgetTrackingService } from './budget-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  controllers: [BudgetTrackingController],
  providers: [BudgetTrackingService],
  exports: [BudgetTrackingService, TypeOrmModule],
})
export class BudgetTrackingModule {}
