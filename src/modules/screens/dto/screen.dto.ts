import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateScreenDto {
  @ApiProperty({ example: 'Default Screen' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Default screen for all projects', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateScreenDto {
  @ApiProperty({ example: 'Default Screen', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Default screen for all projects', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
