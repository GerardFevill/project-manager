import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from '../comments.service';
import { Comment } from '../entities/comment.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  const mockRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockComment = {
    id: '1',
    body: 'Test comment',
    authorId: 'user1',
    issueId: 'issue1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockRepo },
      ],
    }).compile();
    service = module.get<CommentsService>(CommentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a comment', async () => {
      mockRepo.findOne.mockResolvedValue(mockComment);
      const result = await service.findOne('1');
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a comment', async () => {
      mockRepo.create.mockReturnValue(mockComment);
      mockRepo.save.mockResolvedValue(mockComment);
      const result = await service.create({ body: 'Test', issueId: 'issue1' }, 'user1');
      expect(result).toEqual(mockComment);
    });
  });

  describe('update', () => {
    it('should update own comment', async () => {
      mockRepo.findOne.mockResolvedValue(mockComment);
      mockRepo.save.mockResolvedValue({ ...mockComment, body: 'Updated' });
      const result = await service.update('1', { body: 'Updated' }, 'user1');
      expect(result.body).toBe('Updated');
    });

    it('should throw ForbiddenException for other user', async () => {
      mockRepo.findOne.mockResolvedValue(mockComment);
      await expect(service.update('1', { body: 'Updated' }, 'user2')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete own comment', async () => {
      mockRepo.findOne.mockResolvedValue(mockComment);
      await service.remove('1', 'user1');
      expect(mockRepo.remove).toHaveBeenCalled();
    });

    it('should throw ForbiddenException for other user', async () => {
      mockRepo.findOne.mockResolvedValue(mockComment);
      await expect(service.remove('1', 'user2')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findByIssue', () => {
    it('should return comments for issue', async () => {
      mockRepo.find.mockResolvedValue([mockComment]);
      const result = await service.findByIssue('issue1');
      expect(result).toEqual([mockComment]);
    });
  });

  describe('findReplies', () => {
    it('should return replies', async () => {
      mockRepo.find.mockResolvedValue([mockComment]);
      const result = await service.findReplies('comment1');
      expect(result).toEqual([mockComment]);
    });
  });
});
