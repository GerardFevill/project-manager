import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprintsService } from '../sprints.service';
import { Sprint } from '../entities/sprint.entity';
import { Board } from '../../boards/entities/board.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

/**
 * Tests unitaires complets pour SprintsService
 *
 * Couverture:
 * - CRUD de base (findAll, findOne, create, update, remove)
 * - Sprint lifecycle (start, complete)
 * - Board relations (findByBoard)
 */
describe('SprintsService', () => {
  let service: SprintsService;
  let sprintRepository: Repository<Sprint>;
  let boardRepository: Repository<Board>;

  const mockSprintRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockBoardRepository = {
    findOne: jest.fn(),
  };

  const mockBoard = {
    id: 'board1',
    name: 'Test Board',
  };

  const mockSprint: Sprint = {
    id: '1',
    name: 'Sprint 1',
    goal: 'Complete features',
    status: 'Future',
    sequence: 1,
    boardId: 'board1',
    startDate: null,
    endDate: null,
    completedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    board: null,
    issues: [],
  };

  const mockSprints = [
    mockSprint,
    { ...mockSprint, id: '2', name: 'Sprint 2', sequence: 2 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SprintsService,
        {
          provide: getRepositoryToken(Sprint),
          useValue: mockSprintRepository,
        },
        {
          provide: getRepositoryToken(Board),
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    service = module.get<SprintsService>(SprintsService);
    sprintRepository = module.get<Repository<Sprint>>(getRepositoryToken(Sprint));
    boardRepository = module.get<Repository<Board>>(getRepositoryToken(Board));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have sprintRepository injected', () => {
      expect(sprintRepository).toBeDefined();
    });

    it('should have boardRepository injected', () => {
      expect(boardRepository).toBeDefined();
    });
  });

  // ==================== CRUD DE BASE ====================

  describe('findAll', () => {
    it('should return all sprints ordered by sequence', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockSprints),
      };

      mockSprintRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual(mockSprints);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('sprint.board', 'board');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('sprint.sequence', 'ASC');
    });

    it('should filter by boardId when provided', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockSprint]),
      };

      mockSprintRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll('board1');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('sprint.boardId = :boardId', { boardId: 'board1' });
      expect(result).toEqual([mockSprint]);
    });

    it('should return empty array if no sprints', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockSprintRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a sprint by id with board relation', async () => {
      mockSprintRepository.findOne.mockResolvedValue(mockSprint);

      const result = await service.findOne('1');

      expect(result).toEqual(mockSprint);
      expect(mockSprintRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['board'],
      });
    });

    it('should throw NotFoundException if sprint not found', async () => {
      mockSprintRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Sprint with ID 999 not found');
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'New Sprint',
      goal: 'New Goal',
      boardId: 'board1',
      sequence: 1,
    };

    it('should create a new sprint successfully', async () => {
      mockBoardRepository.findOne.mockResolvedValue(mockBoard);
      mockSprintRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockSprintRepository.save.mockResolvedValue({ ...mockSprint, ...createDto });

      const result = await service.create(createDto);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({ where: { id: createDto.boardId } });
      expect(mockSprintRepository.create).toHaveBeenCalledWith({
        ...createDto,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.name).toBe(createDto.name);
    });

    it('should throw BadRequestException if board not found', async () => {
      mockBoardRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Board with ID board1 not found');
      expect(mockSprintRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Sprint',
      goal: 'Updated Goal',
    };

    it('should update a sprint successfully', async () => {
      const updatedSprint = { ...mockSprint, ...updateDto };
      mockSprintRepository.findOne.mockResolvedValue(mockSprint);
      mockSprintRepository.save.mockResolvedValue(updatedSprint);

      const result = await service.update('1', updateDto);

      expect(mockSprintRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockSprint,
          ...updateDto,
          updatedAt: expect.any(Date),
        })
      );
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw NotFoundException if sprint not found', async () => {
      mockSprintRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a sprint successfully', async () => {
      mockSprintRepository.findOne.mockResolvedValue(mockSprint);
      mockSprintRepository.remove.mockResolvedValue(mockSprint);

      await service.remove('1');

      expect(mockSprintRepository.findOne).toHaveBeenCalled();
      expect(mockSprintRepository.remove).toHaveBeenCalledWith(mockSprint);
    });

    it('should throw NotFoundException if sprint not found', async () => {
      mockSprintRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockSprintRepository.remove).not.toHaveBeenCalled();
    });
  });

  // ==================== SPRINT LIFECYCLE ====================

  describe('start', () => {
    it('should start a sprint (set status to Active and startDate)', async () => {
      const futureSprint = { ...mockSprint, status: 'Future', startDate: null };
      mockSprintRepository.findOne.mockResolvedValue(futureSprint);
      mockSprintRepository.save.mockResolvedValue({
        ...futureSprint,
        status: 'Active',
        startDate: expect.any(Date),
      });

      const result = await service.start('1');

      expect(mockSprintRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Active',
          startDate: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result.status).toBe('Active');
    });

    it('should throw NotFoundException if sprint not found', async () => {
      mockSprintRepository.findOne.mockResolvedValue(null);

      await expect(service.start('999')).rejects.toThrow(NotFoundException);
    });

    it('should set startDate to current date', async () => {
      const beforeStart = new Date();
      mockSprintRepository.findOne.mockResolvedValue(mockSprint);
      mockSprintRepository.save.mockImplementation(async (sprint) => {
        expect(sprint.startDate).toBeInstanceOf(Date);
        expect(sprint.startDate.getTime()).toBeGreaterThanOrEqual(beforeStart.getTime());
        return sprint;
      });

      await service.start('1');
    });
  });

  describe('complete', () => {
    it('should complete a sprint (set status to Closed and completedAt)', async () => {
      const activeSprint = { ...mockSprint, status: 'Active', completedAt: null };
      mockSprintRepository.findOne.mockResolvedValue(activeSprint);
      mockSprintRepository.save.mockResolvedValue({
        ...activeSprint,
        status: 'Closed',
        completedAt: expect.any(Date),
      });

      const result = await service.complete('1');

      expect(mockSprintRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'Closed',
          completedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result.status).toBe('Closed');
    });

    it('should throw NotFoundException if sprint not found', async () => {
      mockSprintRepository.findOne.mockResolvedValue(null);

      await expect(service.complete('999')).rejects.toThrow(NotFoundException);
    });

    it('should set completedAt to current date', async () => {
      const beforeComplete = new Date();
      mockSprintRepository.findOne.mockResolvedValue(mockSprint);
      mockSprintRepository.save.mockImplementation(async (sprint) => {
        expect(sprint.completedAt).toBeInstanceOf(Date);
        expect(sprint.completedAt.getTime()).toBeGreaterThanOrEqual(beforeComplete.getTime());
        return sprint;
      });

      await service.complete('1');
    });
  });

  // ==================== BOARD RELATIONS ====================

  describe('findByBoard', () => {
    it('should return sprints for a specific board ordered by sequence', async () => {
      mockSprintRepository.find.mockResolvedValue(mockSprints);

      const result = await service.findByBoard('board1');

      expect(result).toEqual(mockSprints);
      expect(mockSprintRepository.find).toHaveBeenCalledWith({
        where: { boardId: 'board1' },
        relations: ['board'],
        order: { sequence: 'ASC' },
      });
    });

    it('should return empty array if no sprints for board', async () => {
      mockSprintRepository.find.mockResolvedValue([]);

      const result = await service.findByBoard('board-no-sprints');

      expect(result).toEqual([]);
    });

    it('should order sprints by sequence ascending', async () => {
      const unorderedSprints = [
        { ...mockSprint, id: '3', sequence: 3 },
        { ...mockSprint, id: '1', sequence: 1 },
        { ...mockSprint, id: '2', sequence: 2 },
      ];
      mockSprintRepository.find.mockResolvedValue(unorderedSprints);

      await service.findByBoard('board1');

      expect(mockSprintRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { sequence: 'ASC' },
        })
      );
    });
  });
});
