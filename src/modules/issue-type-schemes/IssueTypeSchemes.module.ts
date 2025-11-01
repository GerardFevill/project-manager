import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueTypeScheme } from './entities/IssueTypeScheme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IssueTypeScheme])],
  exports: [TypeOrmModule],
})
export class IssueTypeSchemesModule {}
