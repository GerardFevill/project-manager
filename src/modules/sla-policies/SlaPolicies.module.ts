import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlaPolicy } from './entities/SlaPolicy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SlaPolicy])],
  exports: [TypeOrmModule],
})
export class SlaPoliciesModule {}
