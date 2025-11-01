import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorage } from './entities/FileStorage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileStorage])],
  exports: [TypeOrmModule],
})
export class FileStorageModule {}
