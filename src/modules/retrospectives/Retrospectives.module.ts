import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retrospective } from './entities/Retrospective.entity';
import { RetrospectivesController } from './retrospectives.controller';
import { RetrospectivesService } from './retrospectives.service';

@Module({
  imports: [TypeOrmModule.forFeature([Retrospective])],
  controllers: [RetrospectivesController],
  providers: [RetrospectivesService],
  exports: [RetrospectivesService, TypeOrmModule],
})
export class RetrospectivesModule {}
