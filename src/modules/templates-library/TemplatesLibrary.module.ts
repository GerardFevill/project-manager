import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTemplate } from './entities/ProjectTemplate.entity';
import { TemplatesLibraryController } from './templates-library.controller';
import { TemplatesLibraryService } from './templates-library.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTemplate])],
  controllers: [TemplatesLibraryController],
  providers: [TemplatesLibraryService],
  exports: [TemplatesLibraryService, TypeOrmModule],
})
export class TemplatesLibraryModule {}
