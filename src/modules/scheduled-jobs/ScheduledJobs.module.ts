import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledJob } from './entities/ScheduledJob.entity';
import { ScheduledJobsController } from './scheduled-jobs.controller';
import { ScheduledJobsService } from './scheduled-jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledJob])],
  controllers: [ScheduledJobsController],
  providers: [ScheduledJobsService],
  exports: [ScheduledJobsService, TypeOrmModule],
})
export class ScheduledJobsModule {}
