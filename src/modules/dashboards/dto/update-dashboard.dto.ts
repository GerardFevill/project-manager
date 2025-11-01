import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';
import { DashboardScope } from '../entities/dashboard.entity';

export class UpdateDashboardDto {
  @ApiProperty({ example: 'Updated Dashboard', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DashboardScope, required: false })
  @IsOptional()
  @IsEnum(DashboardScope)
  scope?: DashboardScope;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ example: ['user1', 'user2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];

  @ApiProperty({ example: { columns: 12, rowHeight: 100 }, required: false })
  @IsOptional()
  @IsObject()
  layout?: Record<string, any>;
}
