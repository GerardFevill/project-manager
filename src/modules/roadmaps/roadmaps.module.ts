import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapsController } from './roadmaps.controller';
import { RoadmapsService } from './roadmaps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap])],
  controllers: [RoadmapsController],
  providers: [RoadmapsService],
  exports: [RoadmapsService, TypeOrmModule],
})
export class RoadmapsModule {}
