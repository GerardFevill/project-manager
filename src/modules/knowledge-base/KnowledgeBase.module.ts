import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KnowledgeArticle } from './entities/KnowledgeArticle.entity';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { KnowledgeBaseService } from './knowledge-base.service';

@Module({
  imports: [TypeOrmModule.forFeature([KnowledgeArticle])],
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService],
  exports: [KnowledgeBaseService, TypeOrmModule],
})
export class KnowledgeBaseModule {}
