import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SprintsService } from '../sprints.service';

describe('SprintsService', () => {
  let service;
  const mockRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) })) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SprintsService, { provide: getRepositoryToken({}), useValue: mockRepo }],
    }).compile();
    service = module.get(SprintsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof service.findAll).toBe('function');
    expect(typeof service.findOne).toBe('function');
  });
});
