import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomReport } from './entities/CustomReport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomReport])],
  exports: [TypeOrmModule],
})
export class CustomReportsModule {}
