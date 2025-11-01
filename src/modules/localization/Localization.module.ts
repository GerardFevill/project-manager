import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/Translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  exports: [TypeOrmModule],
})
export class LocalizationModule {}
