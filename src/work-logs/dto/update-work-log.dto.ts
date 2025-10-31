import { IsNumber, IsString, IsDateString, IsOptional, Min, Max } from 'class-validator';

/**
 * DTO for updating a work log entry
 */
export class UpdateWorkLogDto {
  @IsOptional()
  @IsNumber({}, { message: 'Time spent must be a number' })
  @Min(0.01, { message: 'Time spent must be at least 0.01 hours (36 seconds)' })
  @Max(24, { message: 'Time spent cannot exceed 24 hours per entry' })
  timeSpent?: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Work date must be a valid date' })
  workDate?: string;
}
