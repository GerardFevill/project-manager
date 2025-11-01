import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VersionsService } from '../versions.service';
import { Version } from '../entities/version.entity';
import { NotFoundException } from '@nestjs/common';

describe('VersionsService', () => {
  let service: VersionsService;
  const mockRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) })) };
  const mockVersion = { id: '1', name: 'v1.0.0', projectId: 'proj1', released: false };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [VersionsService, { provide: getRepositoryToken(Version), useValue: mockRepo }],
    }).compile();
    service = module.get(VersionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());
  
  describe('findOne', () => {
    it('should return a version', async () => {
      mockRepo.findOne.mockResolvedValue(mockVersion);
      expect(await service.findOne('1')).toEqual(mockVersion);
    });
    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('release', () => {
    it('should mark version as released', async () => {
      mockRepo.findOne.mockResolvedValue(mockVersion);
      mockRepo.save.mockResolvedValue({ ...mockVersion, released: true });
      const result = await service.release('1');
      expect(result.released).toBe(true);
    });
  });
});
