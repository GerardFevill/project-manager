import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Migration } from './entities/Migration.entity';
import { MigrationToolsController } from './migration-tools.controller';
import { MigrationToolsService } from './migration-tools.service';

@Module({
  imports: [TypeOrmModule.forFeature([Migration])],
  controllers: [MigrationToolsController],
  providers: [MigrationToolsService],
  exports: [MigrationToolsService, TypeOrmModule],
})
export class MigrationToolsModule {}
