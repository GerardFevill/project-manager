import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkLog } from '../work-logs/entities/work-log.entity';
import { TimeReportsController } from './time-reports.controller';
import { TimeReportsService } from './time-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkLog])],
  controllers: [TimeReportsController],
  providers: [TimeReportsService],
  exports: [TimeReportsService],
})
export class TimeReportsModule {}
