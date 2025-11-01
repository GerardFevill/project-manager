import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retrospective } from './entities/retrospective.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Retrospective])],
  exports: [TypeOrmModule],
})
export class RetrospectivesModule {}
