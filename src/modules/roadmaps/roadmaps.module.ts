import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap])],
  exports: [TypeOrmModule],
})
export class RoadmapsModule {}
