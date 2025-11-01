import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './entities/Incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Incident])],
  exports: [TypeOrmModule],
})
export class IncidentManagementModule {}
