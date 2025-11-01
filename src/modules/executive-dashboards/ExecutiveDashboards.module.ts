import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutiveDashboard } from './entities/ExecutiveDashboard.entity';
import { ExecutiveDashboardsController } from './executive-dashboards.controller';
import { ExecutiveDashboardsService } from './executive-dashboards.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExecutiveDashboard])],
  controllers: [ExecutiveDashboardsController],
  providers: [ExecutiveDashboardsService],
  exports: [ExecutiveDashboardsService, TypeOrmModule],
})
export class ExecutiveDashboardsModule {}
