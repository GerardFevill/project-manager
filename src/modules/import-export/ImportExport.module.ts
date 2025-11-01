import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportExport } from './entities/ImportExport.entity';
import { ImportExportController } from './import-export.controller';
import { ImportExportService } from './import-export.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImportExport])],
  controllers: [ImportExportController],
  providers: [ImportExportService],
  exports: [ImportExportService, TypeOrmModule],
})
export class ImportExportModule {}
