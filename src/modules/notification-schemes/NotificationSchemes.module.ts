import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationScheme } from './entities/NotificationScheme.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationScheme])],
  exports: [TypeOrmModule],
})
export class NotificationSchemesModule {}
