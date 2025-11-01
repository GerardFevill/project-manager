import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiSuggestion } from './entities/AiSuggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AiSuggestion])],
  exports: [TypeOrmModule],
})
export class AiSuggestionsModule {}
