import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GdprLog } from './entities/GdprLog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GdprLog])],
  exports: [TypeOrmModule],
})
export class GdprComplianceModule {}
