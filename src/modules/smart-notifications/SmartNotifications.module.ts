import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartNotification } from './entities/SmartNotification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartNotification])],
  exports: [TypeOrmModule],
})
export class SmartNotificationsModule {}
