import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomReport } from './entities/CustomReport.entity';
import { CustomReportsController } from './custom-reports.controller';
import { CustomReportsService } from './custom-reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomReport])],
  controllers: [CustomReportsController],
  providers: [CustomReportsService],
  exports: [CustomReportsService, TypeOrmModule],
})
export class CustomReportsModule {}
