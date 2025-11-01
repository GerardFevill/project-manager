import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john.doe' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'SecureP@ssw0rd' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
