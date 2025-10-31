import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  /**
   * Create a new comment
   */
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    const savedComment = await this.commentRepository.save(comment);

    // Return with relations
    return this.findOne(savedComment.id);
  }

  /**
   * Find all comments for an issue
   */
  async findByIssue(issueId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { issueId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find a single comment by ID
   */
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'issue'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  /**
   * Update a comment
   */
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    // Check if user is the author
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    // Update fields
    comment.content = updateCommentDto.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    const updatedComment = await this.commentRepository.save(comment);
    return this.findOne(updatedComment.id);
  }

  /**
   * Delete a comment
   */
  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    // Check if user is the author
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }

  /**
   * Count comments for an issue
   */
  async countByIssue(issueId: string): Promise<number> {
    return this.commentRepository.count({
      where: { issueId },
    });
  }
}
