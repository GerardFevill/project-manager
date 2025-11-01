import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceApp } from './entities/MarketplaceApp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketplaceApp])],
  exports: [TypeOrmModule],
})
export class MarketplaceAppsModule {}
