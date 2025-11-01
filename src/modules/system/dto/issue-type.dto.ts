import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateIssueTypeDto {
  @ApiProperty({ example: 'Bug' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'A problem which impairs or prevents functions', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'bug-icon', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  iconUrl?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  subtask?: boolean;
}

export class UpdateIssueTypeDto {
  @ApiProperty({ example: 'Bug', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'A problem which impairs or prevents functions', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'bug-icon', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  iconUrl?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  subtask?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
