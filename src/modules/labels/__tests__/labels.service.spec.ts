import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LabelsService } from '../labels.service';
import { Label } from '../entities/label.entity';
import { NotFoundException } from '@nestjs/common';

describe('LabelsService', () => {
  let service: LabelsService;
  const mockRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) })) };
  const mockLabel = { id: '1', name: 'bug', color: '#ff0000', projectId: 'proj1' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LabelsService, { provide: getRepositoryToken(Label), useValue: mockRepo }],
    }).compile();
    service = module.get(LabelsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());
  
  describe('findOne', () => {
    it('should return a label', async () => {
      mockRepo.findOne.mockResolvedValue(mockLabel);
      expect(await service.findOne('1')).toEqual(mockLabel);
    });
    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a label', async () => {
      mockRepo.create.mockReturnValue(mockLabel);
      mockRepo.save.mockResolvedValue(mockLabel);
      const result = await service.create({ name: 'bug', color: '#ff0000', projectId: 'proj1' });
      expect(result).toEqual(mockLabel);
    });
  });
});
