import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentRule } from './entities/AssignmentRule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentRule])],
  exports: [TypeOrmModule],
})
export class AutoAssignmentModule {}
