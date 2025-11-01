import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BurnData } from './entities/burn-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BurnData])],
  exports: [TypeOrmModule],
})
export class BurnChartsModule {}
