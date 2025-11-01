import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectTemplate } from './entities/ProjectTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectTemplate])],
  exports: [TypeOrmModule],
})
export class TemplatesLibraryModule {}
