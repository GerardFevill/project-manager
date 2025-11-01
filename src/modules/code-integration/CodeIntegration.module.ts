import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeCommit } from './entities/CodeCommit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodeCommit])],
  exports: [TypeOrmModule],
})
export class CodeIntegrationModule {}
