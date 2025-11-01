import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum IssueLinkType {
  BLOCKS = 'blocks',
  IS_BLOCKED_BY = 'is_blocked_by',
  DUPLICATES = 'duplicates',
  IS_DUPLICATED_BY = 'is_duplicated_by',
  RELATES_TO = 'relates_to',
  CLONES = 'clones',
  IS_CLONED_BY = 'is_cloned_by',
  CAUSES = 'causes',
  IS_CAUSED_BY = 'is_caused_by',
}

export class CreateIssueLinkDto {
  @ApiProperty({ example: '1', description: 'Source issue ID' })
  @IsNotEmpty()
  @IsString()
  sourceIssueId: string;

  @ApiProperty({ example: '2', description: 'Target issue ID' })
  @IsNotEmpty()
  @IsString()
  targetIssueId: string;

  @ApiProperty({
    example: 'blocks',
    enum: IssueLinkType,
    description: 'Type of link relationship'
  })
  @IsNotEmpty()
  @IsEnum(IssueLinkType)
  linkType: string;
}
