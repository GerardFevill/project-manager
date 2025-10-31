import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Component } from './entities/component.entity';
import { Version } from './entities/version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Component, Version]),
  ],
  exports: [TypeOrmModule],
})
export class ProjectsModule {}
