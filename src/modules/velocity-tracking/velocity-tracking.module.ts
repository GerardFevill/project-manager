import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Velocity } from './entities/velocity.entity';
import { VelocityTrackingController } from './velocity-tracking.controller';
import { VelocityTrackingService } from './velocity-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([Velocity])],
  controllers: [VelocityTrackingController],
  providers: [VelocityTrackingService],
  exports: [VelocityTrackingService, TypeOrmModule],
})
export class VelocityTrackingModule {}
