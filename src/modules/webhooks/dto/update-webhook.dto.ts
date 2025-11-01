import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsUrl, IsArray, IsEnum, IsObject, IsBoolean } from 'class-validator';
import { WebhookEvent } from '../entities/webhook.entity';

export class UpdateWebhookDto {
  @ApiProperty({ example: 'Updated Webhook Name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'https://hooks.slack.com/services/yyy', required: false })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ enum: WebhookEvent, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(WebhookEvent, { each: true })
  events?: WebhookEvent[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'new-secret-key', required: false })
  @IsOptional()
  @IsString()
  secret?: string;

  @ApiProperty({ example: { 'Authorization': 'Bearer new-token' }, required: false })
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
