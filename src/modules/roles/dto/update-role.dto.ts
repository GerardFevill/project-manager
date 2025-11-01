import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsArray } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ example: 'Senior Developer', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: ['issue.create', 'issue.edit', 'issue.view', 'issue.delete'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
