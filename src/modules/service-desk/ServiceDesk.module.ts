import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './entities/ServiceRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequest])],
  exports: [TypeOrmModule],
})
export class ServiceDeskModule {}
