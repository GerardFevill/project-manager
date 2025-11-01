import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenScheme } from './entities/ScreenScheme.entity';
import { ScreenSchemesController } from './screen-schemes.controller';
import { ScreenSchemesService } from './screen-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenScheme])],
  controllers: [ScreenSchemesController],
  providers: [ScreenSchemesService],
  exports: [ScreenSchemesService, TypeOrmModule],
})
export class ScreenSchemesModule {}
