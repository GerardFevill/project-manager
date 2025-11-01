import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateApplicationPropertyDto {
  @ApiProperty({ example: '8' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiProperty({ example: 'Time Tracking', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ example: 'Number of working hours per day', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
