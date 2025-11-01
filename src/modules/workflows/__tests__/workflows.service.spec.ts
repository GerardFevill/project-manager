import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowsService } from '../workflows.service';
import { Workflow } from '../entities/workflow.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * Tests unitaires complets pour WorkflowsService
 *
 * Couverture:
 * - CRUD de base (findAll, findOne, create, update, remove)
 * - Transitions (getWorkflowTransitions, updateWorkflowTransition)
 * - Publishing & Draft (publishWorkflow, getDraftWorkflow, createDraftWorkflow)
 * - Propriétés (updateWorkflowProperties)
 * - Workflow Schemes (getWorkflowSchemesForProjects)
 * - Transition Rules (addTransitionRules)
 * - Validation (validateWorkflow)
 * - Recherche (searchWorkflows)
 */
describe('WorkflowsService', () => {
  let service: WorkflowsService;
  let workflowRepository: Repository<Workflow>;

  // Mock repository
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // Données de test
  const mockWorkflow: Workflow = {
    id: '1',
    name: 'Test Workflow',
    description: 'Test Description',
    isActive: true,
    isDefault: false,
    isDraft: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockDraftWorkflow: Workflow = {
    ...mockWorkflow,
    id: '2',
    name: 'Draft Workflow',
    isDraft: true,
  };

  const mockWorkflows = [mockWorkflow, mockDraftWorkflow];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkflowsService,
        {
          provide: getRepositoryToken(Workflow),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WorkflowsService>(WorkflowsService);
    workflowRepository = module.get<Repository<Workflow>>(getRepositoryToken(Workflow));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have workflowRepository injected', () => {
      expect(workflowRepository).toBeDefined();
    });
  });

  // ==================== CRUD DE BASE ====================

  describe('findAll', () => {
    it('should return all workflows sorted by createdAt DESC', async () => {
      mockRepository.find.mockResolvedValue(mockWorkflows);

      const result = await service.findAll();

      expect(result).toEqual(mockWorkflows);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });

    it('should return empty array if no workflows', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a workflow by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.findOne('1');

      expect(result).toEqual(mockWorkflow);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Workflow with ID 999 not found');
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'New Workflow',
      description: 'New Description',
    };

    it('should create a new workflow with default values', async () => {
      mockRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...mockWorkflow, ...createDto });

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        isActive: true,
        isDefault: false,
        isDraft: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.name).toBe(createDto.name);
    });

    it('should set isDraft to true by default for new workflows', async () => {
      mockRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...mockWorkflow, ...createDto, isDraft: true });

      const result = await service.create(createDto);

      expect(result.isDraft).toBe(true);
    });

    it('should set isActive to true by default', async () => {
      mockRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...mockWorkflow, ...createDto, isActive: true });

      const result = await service.create(createDto);

      expect(result.isActive).toBe(true);
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Workflow',
      description: 'Updated Description',
    };

    it('should update a workflow successfully', async () => {
      const updatedWorkflow = { ...mockWorkflow, ...updateDto };
      mockRepository.findOne.mockResolvedValue(mockWorkflow);
      mockRepository.save.mockResolvedValue(updatedWorkflow);

      const result = await service.update('1', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockWorkflow,
          ...updateDto,
          updatedAt: expect.any(Date),
        })
      );
      expect(result.name).toBe(updateDto.name);
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a workflow successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);
      mockRepository.remove.mockResolvedValue(mockWorkflow);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockWorkflow);
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  // ==================== TRANSITIONS ====================

  describe('getWorkflowTransitions', () => {
    it('should return workflow transitions structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.getWorkflowTransitions('1');

      expect(result).toEqual({
        workflowId: '1',
        workflowName: mockWorkflow.name,
        transitions: [],
      });
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getWorkflowTransitions('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateWorkflowTransition', () => {
    const transitionData = {
      name: 'Start Progress',
      fromStatusId: 'open',
      toStatusId: 'in-progress',
    };

    it('should update workflow transition with data and timestamp', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.updateWorkflowTransition('1', 'trans1', transitionData);

      expect(result).toEqual({
        workflowId: '1',
        transitionId: 'trans1',
        updated: true,
        data: transitionData,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateWorkflowTransition('999', 'trans1', transitionData)
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== PUBLISHING & DRAFT ====================

  describe('publishWorkflow', () => {
    it('should publish a draft workflow', async () => {
      mockRepository.findOne.mockResolvedValue(mockDraftWorkflow);
      mockRepository.save.mockResolvedValue({ ...mockDraftWorkflow, isDraft: false, isActive: true });

      const result = await service.publishWorkflow('2');

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isDraft: false,
          isActive: true,
          updatedAt: expect.any(Date),
        })
      );
      expect(result.published).toBe(true);
      expect(result.isDraft).toBe(false);
      expect(result.isActive).toBe(true);
      expect(result.publishedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.publishWorkflow('999')).rejects.toThrow(NotFoundException);
    });

    it('should set isActive to true when publishing', async () => {
      const inactiveWorkflow = { ...mockWorkflow, isActive: false, isDraft: true };
      mockRepository.findOne.mockResolvedValue(inactiveWorkflow);
      mockRepository.save.mockResolvedValue({ ...inactiveWorkflow, isDraft: false, isActive: true });

      const result = await service.publishWorkflow('1');

      expect(result.isActive).toBe(true);
    });
  });

  describe('getDraftWorkflow', () => {
    it('should return draft workflow if isDraft is true', async () => {
      mockRepository.findOne.mockResolvedValue(mockDraftWorkflow);

      const result = await service.getDraftWorkflow('2');

      expect(result).toEqual({
        workflowId: '2',
        workflowName: mockDraftWorkflow.name,
        hasDraft: true,
        draft: mockDraftWorkflow,
        published: null,
      });
    });

    it('should return published workflow if isDraft is false', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.getDraftWorkflow('1');

      expect(result).toEqual({
        workflowId: '1',
        workflowName: mockWorkflow.name,
        hasDraft: false,
        draft: null,
        published: mockWorkflow,
      });
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getDraftWorkflow('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createDraftWorkflow', () => {
    it('should create draft from published workflow', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.createDraftWorkflow('1');

      expect(result.workflowId).toBe('1');
      expect(result.originalWorkflow).toEqual(mockWorkflow);
      expect(result.draft).toHaveProperty('isDraft', true);
      expect(result.draft).toHaveProperty('parentWorkflowId', '1');
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should return existing workflow if already in draft mode', async () => {
      mockRepository.findOne.mockResolvedValue(mockDraftWorkflow);

      const result = await service.createDraftWorkflow('2');

      expect(result.workflowId).toBe('2');
      expect(result.message).toBe('Workflow is already in draft mode');
      expect(result.draft).toEqual(mockDraftWorkflow);
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.createDraftWorkflow('999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== PROPRIÉTÉS ====================

  describe('updateWorkflowProperties', () => {
    const properties = {
      allowedRoles: ['admin', 'developer'],
      options: { autoTransition: true },
    };

    it('should update workflow properties with timestamp', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);
      mockRepository.save.mockResolvedValue(mockWorkflow);

      const result = await service.updateWorkflowProperties('1', properties);

      expect(result).toEqual({
        workflowId: '1',
        workflowName: mockWorkflow.name,
        properties,
        updatedAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateWorkflowProperties('999', properties)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  // ==================== WORKFLOW SCHEMES ====================

  describe('getWorkflowSchemesForProjects', () => {
    it('should return workflow schemes for multiple projects', async () => {
      const result = await service.getWorkflowSchemesForProjects('proj1,proj2,proj3');

      expect(result.requestedProjects).toEqual(['proj1', 'proj2', 'proj3']);
      expect(result.schemes).toHaveLength(3);
      expect(result.schemes[0]).toHaveProperty('projectId', 'proj1');
      expect(result.schemes[0]).toHaveProperty('schemeName', 'Default Workflow Scheme');
      expect(result.schemes[0]).toHaveProperty('mappings');
    });

    it('should handle empty project IDs', async () => {
      const result = await service.getWorkflowSchemesForProjects('');

      expect(result.requestedProjects).toEqual([]);
      expect(result.schemes).toEqual([]);
    });

    it('should trim whitespace from project IDs', async () => {
      const result = await service.getWorkflowSchemesForProjects(' proj1 , proj2 , proj3 ');

      expect(result.requestedProjects).toEqual(['proj1', 'proj2', 'proj3']);
    });

    it('should filter empty IDs', async () => {
      const result = await service.getWorkflowSchemesForProjects('proj1,,proj2');

      expect(result.requestedProjects).toEqual(['proj1', 'proj2']);
    });
  });

  // ==================== TRANSITION RULES ====================

  describe('addTransitionRules', () => {
    const rules = {
      conditions: ['user_is_assignee', 'status_is_open'],
      validators: ['required_field_validator'],
      postFunctions: ['assign_to_current_user', 'send_notification'],
      permissions: ['edit_issues'],
    };

    it('should add transition rules with ruleTypes structure', async () => {
      const result = await service.addTransitionRules(rules);

      expect(result.rules).toEqual(rules);
      expect(result.created).toBe(true);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.ruleTypes).toEqual({
        conditions: rules.conditions,
        validators: rules.validators,
        postFunctions: rules.postFunctions,
        permissions: rules.permissions,
      });
    });

    it('should handle empty rule arrays', async () => {
      const emptyRules = {};
      const result = await service.addTransitionRules(emptyRules);

      expect(result.ruleTypes).toEqual({
        conditions: [],
        validators: [],
        postFunctions: [],
        permissions: [],
      });
    });

    it('should handle partial rules', async () => {
      const partialRules = {
        conditions: ['condition1'],
        validators: ['validator1'],
      };

      const result = await service.addTransitionRules(partialRules);

      expect(result.ruleTypes.conditions).toEqual(['condition1']);
      expect(result.ruleTypes.validators).toEqual(['validator1']);
      expect(result.ruleTypes.postFunctions).toEqual([]);
      expect(result.ruleTypes.permissions).toEqual([]);
    });
  });

  // ==================== VALIDATION ====================

  describe('validateWorkflow', () => {
    it('should validate a correct workflow with no errors', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing workflow name', async () => {
      const invalidWorkflow = { ...mockWorkflow, name: '' };
      mockRepository.findOne.mockResolvedValue(invalidWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Workflow name is required');
    });

    it('should detect workflow name too long', async () => {
      const longName = 'a'.repeat(256);
      const invalidWorkflow = { ...mockWorkflow, name: longName };
      mockRepository.findOne.mockResolvedValue(invalidWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Workflow name is too long (max 255 characters)');
    });

    it('should warn if workflow is in draft mode', async () => {
      mockRepository.findOne.mockResolvedValue(mockDraftWorkflow);

      const result = await service.validateWorkflow('2');

      expect(result.valid).toBe(true); // warnings don't affect validity
      expect(result.warnings).toContain('Workflow is in draft mode and not published');
      expect(result.isDraft).toBe(true);
    });

    it('should warn if workflow is inactive', async () => {
      const inactiveWorkflow = { ...mockWorkflow, isActive: false };
      mockRepository.findOne.mockResolvedValue(inactiveWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.valid).toBe(true); // warnings don't affect validity
      expect(result.warnings).toContain('Workflow is inactive');
      expect(result.isActive).toBe(false);
    });

    it('should handle multiple errors and warnings', async () => {
      const invalidWorkflow = {
        ...mockWorkflow,
        name: '',
        isDraft: true,
        isActive: false,
      };
      mockRepository.findOne.mockResolvedValue(invalidWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('should return validatedAt timestamp', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkflow);

      const result = await service.validateWorkflow('1');

      expect(result.validatedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if workflow not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.validateWorkflow('999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== RECHERCHE ====================

  describe('searchWorkflows', () => {
    it('should search workflows by name or description', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockWorkflows),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.searchWorkflows('test');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('workflow');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('workflow.name LIKE :query', { query: '%test%' });
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith('workflow.description LIKE :query', { query: '%test%' });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('workflow.name', 'ASC');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result).toEqual(mockWorkflows);
    });

    it('should limit results to 20 workflows', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.searchWorkflows('query');

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });

    it('should return empty array if no matches', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.searchWorkflows('nonexistent');

      expect(result).toEqual([]);
    });
  });
});
