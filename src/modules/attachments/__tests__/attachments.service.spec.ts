import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttachmentsService } from '../attachments.service';
import { Attachment } from '../entities/attachment.entity';
import { NotFoundException } from '@nestjs/common';

describe('AttachmentsService', () => {
  let service: AttachmentsService;
  let repository: Repository<Attachment>;

  const mockAttachment = {
    id: '1',
    fileName: 'test.pdf',
    filePath: '/uploads/test.pdf',
    fileSize: 1024,
    mimeType: 'application/pdf',
    issueId: 'issue-1',
    uploaderId: 'user-1',
    createdAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsService,
        {
          provide: getRepositoryToken(Attachment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AttachmentsService>(AttachmentsService);
    repository = module.get(getRepositoryToken(Attachment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all attachments', async () => {
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockAttachment]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      const result = await service.findAll();

      expect(result).toEqual([mockAttachment]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('attachment');
    });

    it('should filter by issueId when provided', async () => {
      const issueId = 'issue-1';
      const queryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockAttachment]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await service.findAll(issueId);

      expect(queryBuilder.where).toHaveBeenCalledWith(
        'attachment.issueId = :issueId',
        { issueId },
      );
    });
  });

  describe('findOne', () => {
    it('should return an attachment by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockAttachment);

      const result = await service.findOne('1');

      expect(result).toEqual(mockAttachment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['uploader', 'issue'],
      });
    });

    it('should throw NotFoundException when attachment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow(
        'Attachment with ID 999 not found',
      );
    });
  });

  describe('create', () => {
    it('should create and save a new attachment', async () => {
      const createDto = {
        fileName: 'new-file.pdf',
        filePath: '/uploads/new-file.pdf',
        fileSize: 2048,
        mimeType: 'application/pdf',
        issueId: 'issue-1',
      };
      const uploaderId = 'user-1';
      const newAttachment = { id: '2', ...createDto, uploaderId };

      mockRepository.create.mockReturnValue(newAttachment);
      mockRepository.save.mockResolvedValue(newAttachment);

      const result = await service.create(createDto, uploaderId);

      expect(result).toEqual(newAttachment);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createDto,
          uploaderId,
          createdAt: expect.any(Date),
        }),
      );
      expect(mockRepository.save).toHaveBeenCalledWith(newAttachment);
    });
  });

  describe('remove', () => {
    it('should remove an attachment', async () => {
      mockRepository.findOne.mockResolvedValue(mockAttachment);
      mockRepository.remove.mockResolvedValue(mockAttachment);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAttachment);
    });

    it('should throw NotFoundException when trying to remove non-existent attachment', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIssue', () => {
    it('should return all attachments for a specific issue', async () => {
      const issueId = 'issue-1';
      mockRepository.find.mockResolvedValue([mockAttachment]);

      const result = await service.findByIssue(issueId);

      expect(result).toEqual([mockAttachment]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { issueId },
        relations: ['uploader'],
        order: { createdAt: 'DESC' },
      });
    });
  });
});
