import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment text', required: false })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
