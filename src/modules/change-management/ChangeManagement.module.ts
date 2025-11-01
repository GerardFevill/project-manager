import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequest } from './entities/ChangeRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequest])],
  exports: [TypeOrmModule],
})
export class ChangeManagementModule {}
