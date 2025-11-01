import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSetting } from './entities/GlobalSetting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSetting])],
  exports: [TypeOrmModule],
})
export class GlobalSettingsModule {}
