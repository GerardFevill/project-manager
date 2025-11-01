import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionScheme } from './entities/PermissionScheme.entity';
import { PermissionSchemesController } from './permission-schemes.controller';
import { PermissionSchemesService } from './permission-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionScheme])],
  controllers: [PermissionSchemesController],
  providers: [PermissionSchemesService],
  exports: [PermissionSchemesService, TypeOrmModule],
})
export class PermissionSchemesModule {}
