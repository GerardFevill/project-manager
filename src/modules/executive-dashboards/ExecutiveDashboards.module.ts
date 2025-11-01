import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutiveDashboard } from './entities/ExecutiveDashboard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutiveDashboard])],
  exports: [TypeOrmModule],
})
export class ExecutiveDashboardsModule {}
