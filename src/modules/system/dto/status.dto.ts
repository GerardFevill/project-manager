import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: 'In Progress' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'The issue is being actively worked on', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'IN_PROGRESS', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ example: '#0052CC', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;
}

export class UpdateStatusDto {
  @ApiProperty({ example: 'In Progress', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'The issue is being actively worked on', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'IN_PROGRESS', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({ example: '#0052CC', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;
}
