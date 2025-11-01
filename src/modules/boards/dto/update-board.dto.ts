import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ example: 'Updated Board Name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  boardName?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
