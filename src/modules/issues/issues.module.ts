import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { RemoteLink } from './entities/remote-link.entity';
import { Project } from '../projects/entities/project.entity';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, RemoteLink, Project])],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService, TypeOrmModule],
})
export class IssuesModule {}
