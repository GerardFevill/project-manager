import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(issueId?: string): Promise<Comment[]> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.issue', 'issue')
      .leftJoinAndSelect('comment.parentComment', 'parentComment')
      .orderBy('comment.createdAt', 'ASC');

    if (issueId) {
      query.where('comment.issueId = :issueId', { issueId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'issue', 'parentComment'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.commentRepository.save(comment);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findOne(id);

    // Only author can update their comment
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    comment.updatedAt = new Date();
    comment.editedAt = new Date();

    return this.commentRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    // Only author can delete their comment
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentRepository.remove(comment);
  }

  async findByIssue(issueId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { issueId },
      relations: ['author', 'parentComment'],
      order: { createdAt: 'ASC' },
    });
  }

  async findReplies(parentCommentId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { parentCommentId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }
}
