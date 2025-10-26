import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks-enhanced.service';
import { TasksController } from './tasks-enhanced.controller';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskHistory])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
