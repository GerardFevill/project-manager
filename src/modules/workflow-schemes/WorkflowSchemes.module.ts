import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowScheme } from './entities/WorkflowScheme.entity';
import { WorkflowSchemesController } from './workflow-schemes.controller';
import { WorkflowSchemesService } from './workflow-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowScheme])],
  controllers: [WorkflowSchemesController],
  providers: [WorkflowSchemesService],
  exports: [WorkflowSchemesService, TypeOrmModule],
})
export class WorkflowSchemesModule {}
