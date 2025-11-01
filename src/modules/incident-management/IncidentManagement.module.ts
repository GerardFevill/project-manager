import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/Incident.entity';
import { IncidentManagementController } from './incident-management.controller';
import { IncidentManagementService } from './incident-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  controllers: [IncidentManagementController],
  providers: [IncidentManagementService],
  exports: [IncidentManagementService, TypeOrmModule],
})
export class IncidentManagementModule {}
