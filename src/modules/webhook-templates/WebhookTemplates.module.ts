import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookTemplate } from './entities/WebhookTemplate.entity';
import { WebhookTemplatesController } from './webhook-templates.controller';
import { WebhookTemplatesService } from './webhook-templates.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookTemplate])],
  controllers: [WebhookTemplatesController],
  providers: [WebhookTemplatesService],
  exports: [WebhookTemplatesService, TypeOrmModule],
})
export class WebhookTemplatesModule {}
