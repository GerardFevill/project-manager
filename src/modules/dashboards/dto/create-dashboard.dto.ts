import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';
import { DashboardScope } from '../entities/dashboard.entity';

export class CreateDashboardDto {
  @ApiProperty({ example: 'My Dashboard' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Dashboard for tracking project metrics', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DashboardScope, example: DashboardScope.PRIVATE })
  @IsEnum(DashboardScope)
  scope: DashboardScope;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({ example: false, required: false })
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
