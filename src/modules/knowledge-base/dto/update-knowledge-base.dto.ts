import { PartialType } from '@nestjs/swagger';
import { CreateKnowledgeArticleDto } from './create-knowledge-base.dto';

export class UpdateKnowledgeArticleDto extends PartialType(CreateKnowledgeArticleDto) {}
