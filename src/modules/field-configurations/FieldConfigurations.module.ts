import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldConfiguration } from './entities/FieldConfiguration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FieldConfiguration])],
  exports: [TypeOrmModule],
})
export class FieldConfigurationsModule {}
