import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { Status } from './entities/status.entity';
import { IssueLink } from './entities/issue-link.entity';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, Status, IssueLink, Attachment]),
  ],
  exports: [TypeOrmModule],
})
export class IssuesModule {}
