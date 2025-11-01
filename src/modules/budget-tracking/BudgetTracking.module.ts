import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/Budget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Budget])],
  exports: [TypeOrmModule],
})
export class BudgetTrackingModule {}
