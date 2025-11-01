import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/ChatMessage.entity';
import { TeamChatController } from './team-chat.controller';
import { TeamChatService } from './team-chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [TeamChatController],
  providers: [TeamChatService],
  exports: [TeamChatService, TypeOrmModule],
})
export class TeamChatModule {}
