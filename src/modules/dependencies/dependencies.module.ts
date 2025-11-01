import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dependency } from './entities/dependency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dependency])],
  exports: [TypeOrmModule],
})
export class DependenciesModule {}
