import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject, IsInt, Min, MaxLength } from 'class-validator';

export class UpdateWidgetDto {
  @ApiProperty({ example: 'Updated Widget Title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({ example: { filterId: '456' }, required: false })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  positionX?: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  positionY?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @ApiProperty({ example: 3, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

  @ApiProperty({ example: 300, required: false })
  @IsOptional()
  @IsInt()
  @Min(30)
  refreshInterval?: number;
}
