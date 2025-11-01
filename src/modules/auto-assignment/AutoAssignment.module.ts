import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentRule } from './entities/AssignmentRule.entity';
import { AutoAssignmentController } from './auto-assignment.controller';
import { AutoAssignmentService } from './auto-assignment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentRule])],
  controllers: [AutoAssignmentController],
  providers: [AutoAssignmentService],
  exports: [AutoAssignmentService, TypeOrmModule],
})
export class AutoAssignmentModule {}
