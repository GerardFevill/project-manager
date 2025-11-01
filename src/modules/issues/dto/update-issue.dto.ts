import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEnum, IsDateString, IsNumber } from 'class-validator';

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  REOPENED = 'Reopened',
}

export enum IssueResolution {
  FIXED = 'Fixed',
  WONT_FIX = 'Won\'t Fix',
  DUPLICATE = 'Duplicate',
  INCOMPLETE = 'Incomplete',
  CANNOT_REPRODUCE = 'Cannot Reproduce',
}

export class UpdateIssueDto {
  @ApiProperty({ example: 'Updated summary', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'In Progress', enum: IssueStatus, required: false })
  @IsOptional()
  @IsEnum(IssueStatus)
  status?: string;

  @ApiProperty({ example: 'High', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: 'Fixed', enum: IssueResolution, required: false })
  @IsOptional()
  @IsEnum(IssueResolution)
  resolution?: string;

  @ApiProperty({ example: '3', description: 'Assignee user ID', required: false })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 7200, description: 'Remaining estimate in seconds', required: false })
  @IsOptional()
  @IsNumber()
  remainingEstimate?: number;

  @ApiProperty({ example: 1800, description: 'Time spent in seconds', required: false })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}
