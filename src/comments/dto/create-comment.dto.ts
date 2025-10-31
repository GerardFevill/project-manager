import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

/**
 * DTO for creating a new comment
 */
export class CreateCommentDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MaxLength(10000, { message: 'Content must not exceed 10000 characters' })
  content: string;

  @IsNotEmpty({ message: 'Issue ID is required' })
  @IsUUID('4', { message: 'Issue ID must be a valid UUID' })
  issueId: string;

  @IsNotEmpty({ message: 'Author ID is required' })
  @IsUUID('4', { message: 'Author ID must be a valid UUID' })
  authorId: string;
}
