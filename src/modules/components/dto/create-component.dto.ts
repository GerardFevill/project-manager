import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

export enum AssigneeType {
  PROJECT_DEFAULT = 'PROJECT_DEFAULT',
  COMPONENT_LEAD = 'COMPONENT_LEAD',
  PROJECT_LEAD = 'PROJECT_LEAD',
  UNASSIGNED = 'UNASSIGNED',
}

export class CreateComponentDto {
  @ApiProperty({ example: '1', description: 'Project ID' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'Backend API' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'All backend API related issues', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2', description: 'Component lead user ID', required: false })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiProperty({
    example: 'COMPONENT_LEAD',
    enum: AssigneeType,
    description: 'Default assignee type for issues',
    required: false
  })
  @IsOptional()
  @IsEnum(AssigneeType)
  assigneeType?: string;
}
