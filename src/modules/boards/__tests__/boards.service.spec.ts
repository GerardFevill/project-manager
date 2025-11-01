import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardsService } from '../boards.service';
import { Board } from '../entities/board.entity';
import { Project } from '../../projects/entities/project.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BoardsService', () => {
  let service: BoardsService;
  const mockBoardRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn(), createQueryBuilder: jest.fn(() => ({ leftJoinAndSelect: jest.fn().mockReturnThis(), where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) })) };
  const mockProjectRepo = { findOne: jest.fn() };
  const mockBoard = { id: '1', name: 'Board 1', type: 'scrum', projectId: 'proj1' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BoardsService, { provide: getRepositoryToken(Board), useValue: mockBoardRepo }, { provide: getRepositoryToken(Project), useValue: mockProjectRepo }],
    }).compile();
    service = module.get(BoardsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());
  
  describe('findOne', () => {
    it('should return a board', async () => {
      mockBoardRepo.findOne.mockResolvedValue(mockBoard);
      expect(await service.findOne('1')).toEqual(mockBoard);
    });
    it('should throw NotFoundException', async () => {
      mockBoardRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create board if project exists', async () => {
      mockProjectRepo.findOne.mockResolvedValue({ id: 'proj1' });
      mockBoardRepo.create.mockReturnValue(mockBoard);
      mockBoardRepo.save.mockResolvedValue(mockBoard);
      const result = await service.create({ name: 'Board 1', projectId: 'proj1', type: 'scrum' });
      expect(result).toEqual(mockBoard);
    });
    it('should throw BadRequestException if project not found', async () => {
      mockProjectRepo.findOne.mockResolvedValue(null);
      await expect(service.create({ name: 'Board', projectId: 'invalid', type: 'scrum' })).rejects.toThrow(BadRequestException);
    });
  });
});
