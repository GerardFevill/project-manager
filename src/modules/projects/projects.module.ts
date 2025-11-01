import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectRoleActor } from './entities/project-role-actor.entity';
import { ProjectFeature } from './entities/project-feature.entity';
import { ProjectAvatar } from './entities/project-avatar.entity';
import { IssueStatistics } from './entities/issue-statistics.entity';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Project,
    ProjectUser,
    ProjectRoleActor,
    ProjectFeature,
    ProjectAvatar,
    IssueStatistics,
  ])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
