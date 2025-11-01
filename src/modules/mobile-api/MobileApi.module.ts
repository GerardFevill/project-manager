import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MobileSession } from './entities/MobileSession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MobileSession])],
  exports: [TypeOrmModule],
})
export class MobileApiModule {}
