import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { IssuesModule } from './modules/issues/issues.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { BoardsModule } from './modules/boards/boards.module';
import { SprintsModule } from './modules/sprints/sprints.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { WatchersModule } from './modules/watchers/watchers.module';
import { LabelsModule } from './modules/labels/labels.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ComponentsModule } from './modules/components/components.module';
import { VersionsModule } from './modules/versions/versions.module';
import { IssueLinksModule } from './modules/issue-links/issue-links.module';
import { RolesModule } from './modules/roles/roles.module';
import { CustomFieldsModule } from './modules/custom-fields/custom-fields.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),

    // Core Modules
    AuthModule,
    UsersModule,

    // Project Management
    ProjectsModule,
    ComponentsModule,
    VersionsModule,
    IssuesModule,
    IssueLinksModule,
    WorkflowsModule,
    BoardsModule,
    SprintsModule,

    // Issue Features
    CommentsModule,
    AttachmentsModule,
    WatchersModule,
    LabelsModule,
    ActivityModule,
    CustomFieldsModule,

    // Security & Access Control
    RolesModule,
  ],
})
export class AppModule {}
