import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequest } from './entities/ServiceRequest.entity';
import { ServiceDeskController } from './service-desk.controller';
import { ServiceDeskService } from './service-desk.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequest])],
  controllers: [ServiceDeskController],
  providers: [ServiceDeskService],
  exports: [ServiceDeskService, TypeOrmModule],
})
export class ServiceDeskModule {}
