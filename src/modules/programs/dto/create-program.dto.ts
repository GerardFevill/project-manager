import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsEnum, MaxLength } from 'class-validator';

export class CreateProgramDto {
  @ApiProperty({ example: 'Digital Transformation Program' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Program to digitalize all business processes', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  portfolioId?: string;

  @ApiProperty({ example: ['proj1', 'proj2'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectIds?: string[];

  @ApiProperty({ example: 'planning', enum: ['planning', 'active', 'on-hold', 'completed'], required: false })
  @IsOptional()
  @IsEnum(['planning', 'active', 'on-hold', 'completed'])
  status?: string;
}
