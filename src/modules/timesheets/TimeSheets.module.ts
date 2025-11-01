import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSheet } from './entities/TimeSheet.entity';
import { TimeSheetsController } from './timesheets.controller';
import { TimeSheetsService } from './timesheets.service';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSheet])],
  controllers: [TimeSheetsController],
  providers: [TimeSheetsService],
  exports: [TimeSheetsService, TypeOrmModule],
})
export class TimeSheetsModule {}
