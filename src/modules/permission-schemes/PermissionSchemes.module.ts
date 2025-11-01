import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionScheme } from './entities/PermissionScheme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionScheme])],
  exports: [TypeOrmModule],
})
export class PermissionSchemesModule {}
