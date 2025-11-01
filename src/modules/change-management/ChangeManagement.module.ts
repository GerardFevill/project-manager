import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequest } from './entities/ChangeRequest.entity';
import { ChangeManagementController } from './change-management.controller';
import { ChangeManagementService } from './change-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequest])],
  controllers: [ChangeManagementController],
  providers: [ChangeManagementService],
  exports: [ChangeManagementService, TypeOrmModule],
})
export class ChangeManagementModule {}
