import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfluencePage } from './entities/ConfluencePage.entity';
import { ConfluenceIntegrationController } from './confluence-integration.controller';
import { ConfluenceIntegrationService } from './confluence-integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfluencePage])],
  controllers: [ConfluenceIntegrationController],
  providers: [ConfluenceIntegrationService],
  exports: [ConfluenceIntegrationService, TypeOrmModule],
})
export class ConfluenceIntegrationModule {}
