import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsDateString, IsNumber } from 'class-validator';

export class CreateVersionDto {
  @ApiProperty({ example: '1', description: 'Project ID' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'v1.0.0' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'First major release', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-03-01', required: false })
  @IsOptional()
  @IsDateString()
  releaseDate?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;
}
