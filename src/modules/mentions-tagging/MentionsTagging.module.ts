import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mention } from './entities/Mention.entity';
import { MentionsTaggingController } from './mentions-tagging.controller';
import { MentionsTaggingService } from './mentions-tagging.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mention])],
  controllers: [MentionsTaggingController],
  providers: [MentionsTaggingService],
  exports: [MentionsTaggingService, TypeOrmModule],
})
export class MentionsTaggingModule {}
