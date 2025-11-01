import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryMap } from './entities/StoryMap.entity';
import { StoryMappingController } from './story-mapping.controller';
import { StoryMappingService } from './story-mapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryMap])],
  controllers: [StoryMappingController],
  providers: [StoryMappingService],
  exports: [StoryMappingService, TypeOrmModule],
})
export class StoryMappingModule {}
