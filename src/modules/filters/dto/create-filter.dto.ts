import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsEnum, IsArray, IsObject, IsBoolean } from 'class-validator';
import { FilterScope } from '../entities/filter.entity';

export class CreateFilterDto {
  @ApiProperty({ example: 'My Open Issues' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'All issues assigned to me that are not resolved', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'assignee = currentUser() AND status != "Done"' })
  @IsNotEmpty()
  @IsString()
  jql: string;

  @ApiProperty({ enum: FilterScope, example: FilterScope.PRIVATE })
  @IsEnum(FilterScope)
  scope: FilterScope;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @ApiProperty({ example: ['user1', 'user2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];

  @ApiProperty({ example: { columns: ['key', 'summary', 'status'] }, required: false })
  @IsOptional()
  @IsObject()
  columnConfig?: Record<string, any>;
}
