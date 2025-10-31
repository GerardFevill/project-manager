import { IsNotEmpty, IsNumber, IsString, IsUUID, IsDateString, IsOptional, Min, Max } from 'class-validator';

/**
 * DTO for creating a work log entry
 */
export class CreateWorkLogDto {
  @IsNotEmpty({ message: 'Time spent is required' })
  @IsNumber({}, { message: 'Time spent must be a number' })
  @Min(0.01, { message: 'Time spent must be at least 0.01 hours (36 seconds)' })
  @Max(24, { message: 'Time spent cannot exceed 24 hours per entry' })
  timeSpent: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Work date is required' })
  @IsDateString({}, { message: 'Work date must be a valid date' })
  workDate: string;

  @IsNotEmpty({ message: 'Task ID is required' })
  @IsUUID('4', { message: 'Task ID must be a valid UUID' })
  taskId: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;
}
