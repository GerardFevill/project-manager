import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityLevel } from './entities/SecurityLevel.entity';
import { SecurityLevelsController } from './security-levels.controller';
import { SecurityLevelsService } from './security-levels.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityLevel])],
  controllers: [SecurityLevelsController],
  providers: [SecurityLevelsService],
  exports: [SecurityLevelsService, TypeOrmModule],
})
export class SecurityLevelsModule {}
