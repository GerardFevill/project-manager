import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum, IsBoolean, IsArray, Matches } from 'class-validator';

export enum CustomFieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  URL = 'url',
  EMAIL = 'email',
  USER = 'user',
}

export class CreateCustomFieldDto {
  @ApiProperty({ example: 'Story Points' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Estimation in story points', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'number', enum: CustomFieldType })
  @IsNotEmpty()
  @IsEnum(CustomFieldType)
  fieldType: string;

  @ApiProperty({ example: 'custom_story_points' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z_][a-z0-9_]*$/, {
    message: 'Field key must be lowercase with underscores only'
  })
  fieldKey: string;

  @ApiProperty({ example: '0', required: false })
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isSearchable?: boolean;

  @ApiProperty({
    example: ['1', '2', '3', '5', '8', '13'],
    description: 'Options for select/multiselect fields',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({ example: '^[0-9]+$', description: 'Validation regex', required: false })
  @IsOptional()
  @IsString()
  validationRegex?: string;

  @ApiProperty({
    example: ['1', '2', '3'],
    description: 'Project IDs where field applies',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextProjects?: string[];

  @ApiProperty({
    example: ['Story', 'Task'],
    description: 'Issue types where field applies',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextIssueTypes?: string[];
}
