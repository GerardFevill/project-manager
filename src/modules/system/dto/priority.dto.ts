import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, MaxLength } from 'class-validator';

export class CreatePriorityDto {
  @ApiProperty({ example: 'High' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'High priority issues', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '#FF0000', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  iconColor?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  sequence?: number;
}

export class UpdatePriorityDto {
  @ApiProperty({ example: 'High', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'High priority issues', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '#FF0000', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  iconColor?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  sequence?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
