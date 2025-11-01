import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloneOperation } from './entities/CloneOperation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CloneOperation])],
  exports: [TypeOrmModule],
})
export class ProjectCloningModule {}
