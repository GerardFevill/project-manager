import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintReport } from './entities/sprint-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SprintReport])],
  exports: [TypeOrmModule],
})
export class SprintReportsModule {}
