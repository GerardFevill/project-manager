import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowScheme } from './entities/WorkflowScheme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowScheme])],
  exports: [TypeOrmModule],
})
export class WorkflowSchemesModule {}
