import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchersService } from '../watchers.service';
import { Watcher } from '../entities/watcher.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('WatchersService', () => {
  let service: WatchersService;
  let repository: Repository<Watcher>;

  const mockWatcher = {
    id: '1',
    issueId: 'issue-1',
    userId: 'user-1',
    addedAt: new Date(),
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WatchersService,
        {
          provide: getRepositoryToken(Watcher),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WatchersService>(WatchersService);
    repository = module.get(getRepositoryToken(Watcher));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all watchers', async () => {
      mockRepository.find.mockResolvedValue([mockWatcher]);

      const result = await service.findAll();

      expect(result).toEqual([mockWatcher]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a watcher by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockWatcher);

      const result = await service.findOne('1');

      expect(result).toEqual(mockWatcher);
    });

    it('should throw NotFoundException when watcher not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new watcher', async () => {
      const createDto = {
        issueId: 'issue-1',
        userId: 'user-1',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockWatcher);
      mockRepository.save.mockResolvedValue(mockWatcher);

      const result = await service.create(createDto);

      expect(result).toEqual(mockWatcher);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if watcher already exists', async () => {
      const createDto = {
        issueId: 'issue-1',
        userId: 'user-1',
      };

      mockRepository.findOne.mockResolvedValue(mockWatcher);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove a watcher', async () => {
      mockRepository.findOne.mockResolvedValue(mockWatcher);
      mockRepository.remove.mockResolvedValue(mockWatcher);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockWatcher);
    });
  });

  describe('findByIssue', () => {
    it('should return all watchers for an issue', async () => {
      mockRepository.find.mockResolvedValue([mockWatcher]);

      const result = await service.findByIssue('issue-1');

      expect(result).toEqual([mockWatcher]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { issueId: 'issue-1' },
        relations: ['user'],
        order: { addedAt: 'DESC' },
      });
    });
  });

  describe('findByUser', () => {
    it('should return all issues watched by a user', async () => {
      mockRepository.find.mockResolvedValue([mockWatcher]);

      const result = await service.findByUser('user-1');

      expect(result).toEqual([mockWatcher]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        relations: ['issue'],
        order: { addedAt: 'DESC' },
      });
    });
  });
});
