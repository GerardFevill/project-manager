import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintReport } from './entities/sprint-report.entity';
import { SprintReportsController } from './sprint-reports.controller';
import { SprintReportsService } from './sprint-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([SprintReport])],
  controllers: [SprintReportsController],
  providers: [SprintReportsService],
  exports: [SprintReportsService, TypeOrmModule],
})
export class SprintReportsModule {}
