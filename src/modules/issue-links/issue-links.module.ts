import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueLink } from './entities/issue-link.entity';
import { IssueLinksController } from './issue-links.controller';
import { IssueLinksService } from './issue-links.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueLink])],
  controllers: [IssueLinksController],
  providers: [IssueLinksService],
  exports: [IssueLinksService],
})
export class IssueLinksModule {}
