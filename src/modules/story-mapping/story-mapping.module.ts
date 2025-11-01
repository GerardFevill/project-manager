import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryMap } from './entities/story-map.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoryMap])],
  exports: [TypeOrmModule],
})
export class StoryMappingModule {}
