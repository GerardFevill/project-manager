import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CumulativeFlow } from './entities/CumulativeFlow.entity';
import { CumulativeFlowController } from './cumulative-flow.controller';
import { CumulativeFlowService } from './cumulative-flow.service';

@Module({
  imports: [TypeOrmModule.forFeature([CumulativeFlow])],
  controllers: [CumulativeFlowController],
  providers: [CumulativeFlowService],
  exports: [CumulativeFlowService, TypeOrmModule],
})
export class CumulativeFlowModule {}
