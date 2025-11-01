import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerTicket } from './entities/CustomerTicket.entity';
import { CustomerPortalController } from './customer-portal.controller';
import { CustomerPortalService } from './customer-portal.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerTicket])],
  controllers: [CustomerPortalController],
  providers: [CustomerPortalService],
  exports: [CustomerPortalService, TypeOrmModule],
})
export class CustomerPortalModule {}
