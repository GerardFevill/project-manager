import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TeamRole } from '../entities/team-member.entity';

export class AddMemberDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: TeamRole, example: TeamRole.MEMBER })
  @IsEnum(TeamRole)
  role: TeamRole;
}
