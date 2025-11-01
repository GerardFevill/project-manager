import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeArticle } from './entities/KnowledgeArticle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeArticle])],
  exports: [TypeOrmModule],
})
export class KnowledgeBaseModule {}
