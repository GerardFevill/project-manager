import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportExport } from './entities/ImportExport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImportExport])],
  exports: [TypeOrmModule],
})
export class ImportExportModule {}
