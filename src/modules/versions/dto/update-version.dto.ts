import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateVersionDto {
  @ApiProperty({ example: 'v1.0.1', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-03-15', required: false })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;
}
