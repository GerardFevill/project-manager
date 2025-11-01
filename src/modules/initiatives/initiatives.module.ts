import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from './entities/initiative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Initiative])],
  exports: [TypeOrmModule],
})
export class InitiativesModule {}
