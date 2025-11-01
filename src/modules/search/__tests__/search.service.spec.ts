import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SearchService } from '../search.service';
import { Issue } from '../../issues/entities/issue.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/comment.entity';

describe('SearchService', () => {
  let service: SearchService;

  const mockRepo = {
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: getRepositoryToken(Issue), useValue: mockRepo },
        { provide: getRepositoryToken(Project), useValue: mockRepo },
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: getRepositoryToken(Comment), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search multiple entity types', async () => {
      const result = await service.search({ query: 'test' });
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('total');
    });

    it('should filter by types', async () => {
      const result = await service.search({ query: 'test', types: ['issue'] });
      expect(result.results).toBeDefined();
    });
  });

  describe('quickSearch', () => {
    it('should return quick results', async () => {
      const results = await service.quickSearch('test');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('searchWithJQL', () => {
    it('should parse basic JQL', async () => {
      const result = await service.searchWithJQL('project = TEST');
      expect(result).toHaveProperty('jql');
      expect(result).toHaveProperty('parsed');
    });
  });

  describe('searchUsers', () => {
    it('should return users search results', async () => {
      const result = await service.searchUsers('john');
      expect(result).toHaveProperty('query');
      expect(result).toHaveProperty('users');
    });
  });

  describe('searchProjects', () => {
    it('should return projects search results', async () => {
      const result = await service.searchProjects('test');
      expect(result).toHaveProperty('query');
      expect(result).toHaveProperty('projects');
    });
  });
});
