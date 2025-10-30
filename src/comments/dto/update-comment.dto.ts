import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for updating a comment
 */
export class UpdateCommentDto {
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MaxLength(10000, { message: 'Content must not exceed 10000 characters' })
  content: string;
}
