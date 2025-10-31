import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Task } from '../tasks/task.entity';
import { User } from '../users/user.entity';
import { WorkLog } from '../work-logs/work-log.entity';
import { Comment } from '../comments/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User, WorkLog, Comment])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
