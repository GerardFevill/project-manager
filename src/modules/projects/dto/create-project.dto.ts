import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, MinLength, Matches, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'PROJ', description: 'Unique project key (2-10 uppercase letters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/^[A-Z]+$/, { message: 'Project key must be uppercase letters only' })
  projectKey: string;

  @ApiProperty({ example: 'My Project' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  projectName: string;

  @ApiProperty({ example: 'Project description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'software', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectType?: string;

  @ApiProperty({ example: '1', description: 'Lead user ID', required: false })
  @IsOptional()
  @IsString()
  leadUserId?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
