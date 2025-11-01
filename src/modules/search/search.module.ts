import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '../issues/entities/issue.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comment.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Project, User, Comment])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
