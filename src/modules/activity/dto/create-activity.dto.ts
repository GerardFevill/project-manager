import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({ example: '1', description: 'Issue ID' })
  @IsNotEmpty()
  @IsString()
  issueId: string;

  @ApiProperty({ example: 'status_changed', description: 'Type of activity' })
  @IsNotEmpty()
  @IsString()
  activityType: string;

  @ApiProperty({ example: 'status', required: false })
  @IsOptional()
  @IsString()
  fieldName?: string;

  @ApiProperty({ example: 'Open', required: false })
  @IsOptional()
  @IsString()
  oldValue?: string;

  @ApiProperty({ example: 'In Progress', required: false })
  @IsOptional()
  @IsString()
  newValue?: string;

  @ApiProperty({ example: 'Status changed from Open to In Progress', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
