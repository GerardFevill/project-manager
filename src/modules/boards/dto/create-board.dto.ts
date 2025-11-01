import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength, IsEnum, IsBoolean } from 'class-validator';

export enum BoardType {
  SCRUM = 'scrum',
  KANBAN = 'kanban',
}

export class CreateBoardDto {
  @ApiProperty({ example: 'Sprint Board' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  boardName: string;

  @ApiProperty({ example: 'scrum', enum: BoardType })
  @IsNotEmpty()
  @IsEnum(BoardType)
  boardType: string;

  @ApiProperty({ example: '1', description: 'Project ID' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'Main development board', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
