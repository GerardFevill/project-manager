import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartNotification } from './entities/SmartNotification.entity';
import { SmartNotificationsController } from './smart-notifications.controller';
import { SmartNotificationsService } from './smart-notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmartNotification])],
  controllers: [SmartNotificationsController],
  providers: [SmartNotificationsService],
  exports: [SmartNotificationsService, TypeOrmModule],
})
export class SmartNotificationsModule {}
