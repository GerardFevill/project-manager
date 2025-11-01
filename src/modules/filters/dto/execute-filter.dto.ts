import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class ExecuteFilterDto {
  @ApiProperty({ example: 'assignee = currentUser() AND status = "In Progress"' })
  @IsNotEmpty()
  @IsString()
  jql: string;

  @ApiProperty({ example: 0, required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiProperty({ example: 50, required: false, default: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
