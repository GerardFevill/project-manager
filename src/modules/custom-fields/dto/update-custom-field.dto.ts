import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsBoolean, IsArray } from 'class-validator';

export class UpdateCustomFieldDto {
  @ApiProperty({ example: 'Updated Name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: '5', required: false })
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isSearchable?: boolean;

  @ApiProperty({ example: ['1', '2', '3', '5', '8'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({ example: '^[0-9]+$', required: false })
  @IsOptional()
  @IsString()
  validationRegex?: string;

  @ApiProperty({ example: ['1', '2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextProjects?: string[];

  @ApiProperty({ example: ['Story'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextIssueTypes?: string[];
}
