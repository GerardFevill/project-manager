import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CumulativeFlow } from './entities/cumulative-flow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CumulativeFlow])],
  exports: [TypeOrmModule],
})
export class CumulativeFlowModule {}
