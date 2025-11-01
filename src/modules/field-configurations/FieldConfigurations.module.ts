import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldConfiguration } from './entities/FieldConfiguration.entity';
import { FieldConfigurationsController } from './field-configurations.controller';
import { FieldConfigurationsService } from './field-configurations.service';

@Module({
  imports: [TypeOrmModule.forFeature([FieldConfiguration])],
  controllers: [FieldConfigurationsController],
  providers: [FieldConfigurationsService],
  exports: [FieldConfigurationsService, TypeOrmModule],
})
export class FieldConfigurationsModule {}
