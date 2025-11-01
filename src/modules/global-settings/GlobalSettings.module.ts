import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSetting } from './entities/GlobalSetting.entity';
import { GlobalSettingsController } from './global-settings.controller';
import { GlobalSettingsService } from './global-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSetting])],
  controllers: [GlobalSettingsController],
  providers: [GlobalSettingsService],
  exports: [GlobalSettingsService, TypeOrmModule],
})
export class GlobalSettingsModule {}
