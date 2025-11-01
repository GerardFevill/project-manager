import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SLA } from './entities/sla.entity';
import { SLAController } from './sla.controller';
import { SLAService } from './sla.service';

@Module({
  imports: [TypeOrmModule.forFeature([SLA])],
  controllers: [SLAController],
  providers: [SLAService],
  exports: [SLAService],
})
export class SLAModule {}
