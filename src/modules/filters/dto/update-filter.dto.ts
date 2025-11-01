import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';
import { FilterScope } from '../entities/filter.entity';

export class UpdateFilterDto {
  @ApiProperty({ example: 'Updated Filter Name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'status = "In Progress"', required: false })
  @IsOptional()
  @IsString()
  jql?: string;

  @ApiProperty({ enum: FilterScope, required: false })
  @IsOptional()
  @IsEnum(FilterScope)
  scope?: FilterScope;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({ example: ['user1', 'user2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];

  @ApiProperty({ example: { columns: ['key', 'summary'] }, required: false })
  @IsOptional()
  @IsObject()
  columnConfig?: Record<string, any>;
}
