import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Priority } from './entities/Priority.entity';
import { IssueType } from './entities/IssueType.entity';
import { Resolution } from './entities/Resolution.entity';
import { Status } from './entities/Status.entity';
import { ServerInfo } from './entities/ServerInfo.entity';
import { ApplicationProperty } from './entities/ApplicationProperty.entity';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Priority,
      IssueType,
      Resolution,
      Status,
      ServerInfo,
      ApplicationProperty,
    ]),
  ],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService, TypeOrmModule],
})
export class SystemModule {}
