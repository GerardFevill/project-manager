import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateScreenSchemeDto {
  @ApiProperty({ example: 'Example name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
