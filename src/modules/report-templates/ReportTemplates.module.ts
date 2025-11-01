import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportTemplate } from './entities/ReportTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportTemplate])],
  exports: [TypeOrmModule],
})
export class ReportTemplatesModule {}
