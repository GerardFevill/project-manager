import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mention } from './entities/Mention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mention])],
  exports: [TypeOrmModule],
})
export class MentionsTaggingModule {}
