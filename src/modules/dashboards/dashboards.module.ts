import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dashboard } from './entities/dashboard.entity';
import { DashboardWidget } from './entities/dashboard-widget.entity';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dashboard, DashboardWidget])],
  controllers: [DashboardsController],
  providers: [DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
