import { PartialType } from '@nestjs/swagger';
import { CreateAiSuggestionDto } from './create-ai-suggestions.dto';

export class UpdateAiSuggestionDto extends PartialType(CreateAiSuggestionDto) {}
