import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ComponentsService } from '../components.service';
import { Component } from '../entities/component.entity';
import { NotFoundException } from '@nestjs/common';

describe('ComponentsService', () => {
  let service: ComponentsService;
  const mockRepo = { findOne: jest.fn(), find: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]) })) };
  const mockComponent = { id: '1', name: 'Component 1', projectId: 'proj1' };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ComponentsService, { provide: getRepositoryToken(Component), useValue: mockRepo }],
    }).compile();
    service = module.get(ComponentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => expect(service).toBeDefined());
  
  describe('findOne', () => {
    it('should return a component', async () => {
      mockRepo.findOne.mockResolvedValue(mockComponent);
      expect(await service.findOne('1')).toEqual(mockComponent);
    });
    it('should throw NotFoundException', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a component', async () => {
      mockRepo.create.mockReturnValue(mockComponent);
      mockRepo.save.mockResolvedValue(mockComponent);
      const result = await service.create({ name: 'Component 1', projectId: 'proj1' });
      expect(result).toEqual(mockComponent);
    });
  });
});
