import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsUrl, IsArray, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { WebhookEvent } from '../entities/webhook.entity';

export class CreateWebhookDto {
  @ApiProperty({ example: 'Slack Notification Webhook' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'https://hooks.slack.com/services/xxx' })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ enum: WebhookEvent, isArray: true, example: [WebhookEvent.ISSUE_CREATED] })
  @IsArray()
  @IsEnum(WebhookEvent, { each: true })
  events: WebhookEvent[];

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'your-secret-key', required: false })
  @IsOptional()
  @IsString()
  secret?: string;

  @ApiProperty({ example: { 'Authorization': 'Bearer token' }, required: false })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
