import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledJob } from './entities/ScheduledJob.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledJob])],
  exports: [TypeOrmModule],
})
export class ScheduledJobsModule {}
