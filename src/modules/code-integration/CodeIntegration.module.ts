import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeCommit } from './entities/CodeCommit.entity';
import { CodeIntegrationController } from './code-integration.controller';
import { CodeIntegrationService } from './code-integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([CodeCommit])],
  controllers: [CodeIntegrationController],
  providers: [CodeIntegrationService],
  exports: [CodeIntegrationService, TypeOrmModule],
})
export class CodeIntegrationModule {}
