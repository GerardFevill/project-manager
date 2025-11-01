import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from './entities/Release.entity';
import { ReleaseManagementController } from './release-management.controller';
import { ReleaseManagementService } from './release-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([Release])],
  controllers: [ReleaseManagementController],
  providers: [ReleaseManagementService],
  exports: [ReleaseManagementService, TypeOrmModule],
})
export class ReleaseManagementModule {}
