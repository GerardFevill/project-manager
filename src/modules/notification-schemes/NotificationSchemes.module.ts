import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationScheme } from './entities/NotificationScheme.entity';
import { NotificationSchemesController } from './notification-schemes.controller';
import { NotificationSchemesService } from './notification-schemes.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationScheme])],
  controllers: [NotificationSchemesController],
  providers: [NotificationSchemesService],
  exports: [NotificationSchemesService, TypeOrmModule],
})
export class NotificationSchemesModule {}
