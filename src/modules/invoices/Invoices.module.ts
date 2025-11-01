import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/Invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice])],
  exports: [TypeOrmModule],
})
export class InvoicesModule {}
