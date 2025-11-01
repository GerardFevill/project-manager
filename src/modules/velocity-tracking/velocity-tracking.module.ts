import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Velocity } from './entities/velocity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Velocity])],
  exports: [TypeOrmModule],
})
export class VelocityTrackingModule {}
