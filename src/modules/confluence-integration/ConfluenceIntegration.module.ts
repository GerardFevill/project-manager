import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfluencePage } from './entities/ConfluencePage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConfluencePage])],
  exports: [TypeOrmModule],
})
export class ConfluenceIntegrationModule {}
