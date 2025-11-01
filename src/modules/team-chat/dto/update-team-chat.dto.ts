import { PartialType } from '@nestjs/swagger';
import { CreateChatMessageDto } from './create-team-chat.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}
