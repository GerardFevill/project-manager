import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityLevel } from './entities/SecurityLevel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityLevel])],
  exports: [TypeOrmModule],
})
export class SecurityLevelsModule {}
