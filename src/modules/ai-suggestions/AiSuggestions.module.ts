import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiSuggestion } from './entities/AiSuggestion.entity';
import { AiSuggestionsController } from './ai-suggestions.controller';
import { AiSuggestionsService } from './ai-suggestions.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiSuggestion])],
  controllers: [AiSuggestionsController],
  providers: [AiSuggestionsService],
  exports: [AiSuggestionsService, TypeOrmModule],
})
export class AiSuggestionsModule {}
