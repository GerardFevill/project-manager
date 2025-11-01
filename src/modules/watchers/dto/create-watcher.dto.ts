import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWatcherDto {
  @ApiProperty({ example: '1', description: 'Issue ID to watch' })
  @IsNotEmpty()
  @IsString()
  issueId: string;
}
