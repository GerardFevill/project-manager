import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetFieldValueDto {
  @ApiProperty({ example: '1', description: 'Issue ID' })
  @IsNotEmpty()
  @IsString()
  issueId: string;

  @ApiProperty({ example: '2', description: 'Custom Field ID' })
  @IsNotEmpty()
  @IsString()
  customFieldId: string;

  @ApiProperty({ example: '8', description: 'Field value' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
