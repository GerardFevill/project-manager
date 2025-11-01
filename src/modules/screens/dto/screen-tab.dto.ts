import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsArray, MaxLength } from 'class-validator';

export class CreateScreenTabDto {
  @ApiProperty({ example: 'Field Tab' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ example: ['summary', 'description', 'assignee'], required: false })
  @IsOptional()
  @IsArray()
  fields?: string[];
}

export class UpdateScreenTabDto {
  @ApiProperty({ example: 'Field Tab', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({ example: ['summary', 'description', 'assignee'], required: false })
  @IsOptional()
  @IsArray()
  fields?: string[];
}

export class AddFieldToTabDto {
  @ApiProperty({ example: 'customfield_10001' })
  @IsNotEmpty()
  @IsString()
  fieldId: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  position?: number;
}
