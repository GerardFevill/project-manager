import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependency } from './entities/dependency.entity';
import { DependenciesController } from './dependencies.controller';
import { DependenciesService } from './dependencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dependency])],
  controllers: [DependenciesController],
  providers: [DependenciesService],
  exports: [DependenciesService, TypeOrmModule],
})
export class DependenciesModule {}
