import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsEnum, IsBoolean } from 'class-validator';
import { AssigneeType } from './create-component.dto';

export class UpdateComponentDto {
  @ApiProperty({ example: 'Frontend UI', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'Updated description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '3', required: false })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiProperty({ enum: AssigneeType, required: false })
  @IsOptional()
  @IsEnum(AssigneeType)
  assigneeType?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
