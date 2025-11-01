import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/Translation.entity';
import { LocalizationController } from './localization.controller';
import { LocalizationService } from './localization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  controllers: [LocalizationController],
  providers: [LocalizationService],
  exports: [LocalizationService, TypeOrmModule],
})
export class LocalizationModule {}
