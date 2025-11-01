import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AssignProjectRoleDto {
  @ApiProperty({ example: '1', description: 'Project ID' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ example: '2', description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '3', description: 'Role ID' })
  @IsNotEmpty()
  @IsString()
  roleId: string;
}
