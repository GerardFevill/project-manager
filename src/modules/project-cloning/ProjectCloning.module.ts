import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloneOperation } from './entities/CloneOperation.entity';
import { ProjectCloningController } from './project-cloning.controller';
import { ProjectCloningService } from './project-cloning.service';

@Module({
  imports: [TypeOrmModule.forFeature([CloneOperation])],
  controllers: [ProjectCloningController],
  providers: [ProjectCloningService],
  exports: [ProjectCloningService, TypeOrmModule],
})
export class ProjectCloningModule {}
