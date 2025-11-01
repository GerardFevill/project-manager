import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueChange } from './entities/issue-change.entity';
import { IssueHistoryController } from './issue-history.controller';
import { IssueHistoryService } from './issue-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueChange])],
  controllers: [IssueHistoryController],
  providers: [IssueHistoryService],
  exports: [IssueHistoryService],
})
export class IssueHistoryModule {}
