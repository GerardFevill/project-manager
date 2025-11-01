import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'My Updated Project', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  projectName?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'software', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectType?: string;

  @ApiProperty({ example: '2', description: 'Lead user ID', required: false })
  @IsOptional()
  @IsString()
  leadUserId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
