import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Initiative } from './entities/Initiative.entity';
import { InitiativesController } from './initiatives.controller';
import { InitiativesService } from './initiatives.service';

@Module({
  imports: [TypeOrmModule.forFeature([Initiative])],
  controllers: [InitiativesController],
  providers: [InitiativesService],
  exports: [InitiativesService, TypeOrmModule],
})
export class InitiativesModule {}
