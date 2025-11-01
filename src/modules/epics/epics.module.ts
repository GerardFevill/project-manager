import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './entities/epic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  exports: [TypeOrmModule],
})
export class EpicsModule {}
