import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookTemplate } from './entities/WebhookTemplate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookTemplate])],
  exports: [TypeOrmModule],
})
export class WebhookTemplatesModule {}
