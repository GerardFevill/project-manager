import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/ChatMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  exports: [TypeOrmModule],
})
export class TeamChatModule {}
