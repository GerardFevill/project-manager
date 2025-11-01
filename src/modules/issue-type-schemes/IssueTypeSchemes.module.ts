import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueTypeScheme } from './entities/IssueTypeScheme.entity';
import { IssueTypeSchemesController } from './issue-type-schemes.controller';
import { IssueTypeSchemesService } from './issue-type-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([IssueTypeScheme])],
  controllers: [IssueTypeSchemesController],
  providers: [IssueTypeSchemesService],
  exports: [IssueTypeSchemesService, TypeOrmModule],
})
export class IssueTypeSchemesModule {}
