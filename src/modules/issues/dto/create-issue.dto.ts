import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum, IsDateString, IsNumber } from 'class-validator';

export enum IssueType {
  BUG = 'Bug',
  TASK = 'Task',
  STORY = 'Story',
  EPIC = 'Epic',
  SUBTASK = 'Sub-task',
}

export enum IssuePriority {
  HIGHEST = 'Highest',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  LOWEST = 'Lowest',
}

export class CreateIssueDto {
  @ApiProperty({ example: '1', description: 'Project ID' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'Bug', enum: IssueType })
  @IsNotEmpty()
  @IsEnum(IssueType)
  issueType: string;

  @ApiProperty({ example: 'Login button not working' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  summary: string;

  @ApiProperty({ example: 'Detailed description of the issue', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Medium', enum: IssuePriority, required: false })
  @IsOptional()
  @IsEnum(IssuePriority)
  priority?: string;

  @ApiProperty({ example: '1', description: 'Reporter user ID', required: false })
  @IsOptional()
  @IsString()
  reporterId?: string;

  @ApiProperty({ example: '2', description: 'Assignee user ID', required: false })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 3600, description: 'Original estimate in seconds', required: false })
  @IsOptional()
  @IsNumber()
  originalEstimate?: number;
}
