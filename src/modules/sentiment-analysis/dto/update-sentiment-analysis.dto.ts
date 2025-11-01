import { PartialType } from '@nestjs/swagger';
import { CreateSentimentLogDto } from './create-sentiment-analysis.dto';

export class UpdateSentimentLogDto extends PartialType(CreateSentimentLogDto) {}
