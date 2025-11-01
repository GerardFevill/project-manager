import { PartialType } from '@nestjs/swagger';
import { CreateWebhookTemplateDto } from './create-webhook-templates.dto';

export class UpdateWebhookTemplateDto extends PartialType(CreateWebhookTemplateDto) {}
