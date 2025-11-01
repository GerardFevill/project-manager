import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateWorkflowDto {
  @ApiProperty({ example: 'Software Development Workflow' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  workflowName: string;

  @ApiProperty({ example: 'Default workflow for software projects', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
