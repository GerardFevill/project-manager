import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileStorage } from './entities/FileStorage.entity';
import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileStorage])],
  controllers: [FileStorageController],
  providers: [FileStorageService],
  exports: [FileStorageService, TypeOrmModule],
})
export class FileStorageModule {}
