import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceApp } from './entities/MarketplaceApp.entity';
import { MarketplaceAppsController } from './marketplace-apps.controller';
import { MarketplaceAppsService } from './marketplace-apps.service';

@Module({
  imports: [TypeOrmModule.forFeature([MarketplaceApp])],
  controllers: [MarketplaceAppsController],
  providers: [MarketplaceAppsService],
  exports: [MarketplaceAppsService, TypeOrmModule],
})
export class MarketplaceAppsModule {}
