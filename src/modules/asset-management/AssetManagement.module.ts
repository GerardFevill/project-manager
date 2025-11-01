import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './entities/Asset.entity';
import { AssetManagementController } from './asset-management.controller';
import { AssetManagementService } from './asset-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  controllers: [AssetManagementController],
  providers: [AssetManagementService],
  exports: [AssetManagementService, TypeOrmModule],
})
export class AssetManagementModule {}
