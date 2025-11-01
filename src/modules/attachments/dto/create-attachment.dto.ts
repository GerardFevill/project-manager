import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({ example: '1', description: 'Issue ID' })
  @IsNotEmpty()
  @IsString()
  issueId: string;

  @ApiProperty({ example: 'screenshot.png' })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({ example: '/uploads/issues/1/screenshot.png' })
  @IsNotEmpty()
  @IsString()
  filePath: string;

  @ApiProperty({ example: 1048576, description: 'File size in bytes' })
  @IsNotEmpty()
  @IsNumber()
  fileSize: number;

  @ApiProperty({ example: 'image/png' })
  @IsNotEmpty()
  @IsString()
  mimeType: string;
}
