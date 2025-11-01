import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlaPolicy } from './entities/SlaPolicy.entity';
import { SlaPoliciesController } from './sla-policies.controller';
import { SlaPoliciesService } from './sla-policies.service';

@Module({
  imports: [TypeOrmModule.forFeature([SlaPolicy])],
  controllers: [SlaPoliciesController],
  providers: [SlaPoliciesService],
  exports: [SlaPoliciesService, TypeOrmModule],
})
export class SlaPoliciesModule {}
