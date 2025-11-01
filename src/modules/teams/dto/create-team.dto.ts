import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Backend Team' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Team responsible for backend development', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  leadId?: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}
