import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsDateString, IsEnum } from 'class-validator';

export enum SprintStatus {
  FUTURE = 'Future',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
}

export class UpdateSprintDto {
  @ApiProperty({ example: 'Updated Sprint Name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  sprintName?: string;

  @ApiProperty({ example: 'Updated sprint goal', required: false })
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

  @ApiProperty({ example: 'Active', enum: SprintStatus, required: false })
  @IsOptional()
  @IsEnum(SprintStatus)
  status?: string;
}
