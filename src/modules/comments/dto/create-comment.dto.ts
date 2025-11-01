import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '1', description: 'Issue ID' })
  @IsNotEmpty()
  @IsString()
  issueId: string;

  @ApiProperty({ example: 'This is a comment on the issue' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({ example: false, description: 'Internal comment visible only to team', required: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;

  @ApiProperty({ example: '5', description: 'Parent comment ID for replies', required: false })
  @IsOptional()
  @IsString()
  parentCommentId?: string;
}
