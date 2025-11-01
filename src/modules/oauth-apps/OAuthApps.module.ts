import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthApp } from './entities/OAuthApp.entity';
import { OAuthAppsController } from './oauth-apps.controller';
import { OAuthAppsService } from './oauth-apps.service';

@Module({
  imports: [TypeOrmModule.forFeature([OAuthApp])],
  controllers: [OAuthAppsController],
  providers: [OAuthAppsService],
  exports: [OAuthAppsService, TypeOrmModule],
})
export class OAuthAppsModule {}
