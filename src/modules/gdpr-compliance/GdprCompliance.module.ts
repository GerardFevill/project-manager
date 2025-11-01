import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GdprLog } from './entities/GdprLog.entity';
import { GdprComplianceController } from './gdpr-compliance.controller';
import { GdprComplianceService } from './gdpr-compliance.service';

@Module({
  imports: [TypeOrmModule.forFeature([GdprLog])],
  controllers: [GdprComplianceController],
  providers: [GdprComplianceService],
  exports: [GdprComplianceService, TypeOrmModule],
})
export class GdprComplianceModule {}
