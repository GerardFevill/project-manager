import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsDateString, IsNumber } from 'class-validator';

export class CreateSprintDto {
  @ApiProperty({ example: 'Sprint 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  sprintName: string;

  @ApiProperty({ example: '1', description: 'Board ID' })
  @IsNotEmpty()
  @IsString()
  boardId: string;

  @ApiProperty({ example: 'Complete user authentication', required: false })
  @IsOptional()
  @IsString()
  sprintGoal?: string;

  @ApiProperty({ example: '2024-01-01', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-01-14', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  sequence?: number;
}
