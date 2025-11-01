import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthApp } from './entities/OAuthApp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OAuthApp])],
  exports: [TypeOrmModule],
})
export class OAuthAppsModule {}
