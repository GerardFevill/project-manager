import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScreenScheme } from './entities/ScreenScheme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScreenScheme])],
  exports: [TypeOrmModule],
})
export class ScreenSchemesModule {}
