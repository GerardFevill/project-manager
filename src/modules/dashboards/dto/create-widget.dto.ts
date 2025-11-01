import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsObject, IsInt, Min, MaxLength } from 'class-validator';
import { WidgetType } from '../entities/dashboard-widget.entity';

export class CreateWidgetDto {
  @ApiProperty({ example: 'Issue Statistics' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ enum: WidgetType, example: WidgetType.ISSUE_STATISTICS })
  @IsEnum(WidgetType)
  type: WidgetType;

  @ApiProperty({ example: { filterId: '123' } })
  @IsObject()
  config: Record<string, any>;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  positionX: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  positionY: number;

  @ApiProperty({ example: 4 })
  @IsInt()
  @Min(1)
  width: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  height: number;

  @ApiProperty({ example: 300, required: false })
  @IsInt()
  @Min(30)
  refreshInterval?: number;
}
