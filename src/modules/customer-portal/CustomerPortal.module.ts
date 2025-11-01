import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTicket } from './entities/CustomerTicket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTicket])],
  exports: [TypeOrmModule],
})
export class CustomerPortalModule {}
