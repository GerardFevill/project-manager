import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Migration } from './entities/Migration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Migration])],
  exports: [TypeOrmModule],
})
export class MigrationToolsModule {}
