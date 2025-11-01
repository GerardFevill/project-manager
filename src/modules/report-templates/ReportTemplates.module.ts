import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportTemplate } from './entities/ReportTemplate.entity';
import { ReportTemplatesController } from './report-templates.controller';
import { ReportTemplatesService } from './report-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportTemplate])],
  controllers: [ReportTemplatesController],
  providers: [ReportTemplatesService],
  exports: [ReportTemplatesService, TypeOrmModule],
})
export class ReportTemplatesModule {}
