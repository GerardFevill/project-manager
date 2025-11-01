import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { IssuesService } from '../issues.service';
import { Issue } from '../entities/issue.entity';
import { RemoteLink } from '../entities/remote-link.entity';
import { Project } from '../../projects/entities/project.entity';

/**
 * Tests unitaires pour IssuesService
 *
 * Ces tests vérifient le comportement de chaque méthode du service
 * en isolation, avec des mocks pour les dépendances.
 */
describe('IssuesService', () => {
  let service: IssuesService;
  let issueRepository: Repository<Issue>;
  let remoteLinkRepository: Repository<RemoteLink>;
  let projectRepository: Repository<Project>;

  // Données de test
  const mockProject: Partial<Project> = {
    id: '1',
    projectKey: 'TEST',
    name: 'Test Project',
  };

  const mockIssue: Partial<Issue> = {
    id: '1',
    issueKey: 'TEST-1',
    projectId: '1',
    summary: 'Test Issue',
    description: 'Test Description',
    issueType: 'Task',
    status: 'Open',
    priority: 'Medium',
    reporterId: '1',
    assigneeId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockRemoteLink: Partial<RemoteLink> = {
    id: '1',
    issueId: '1',
    url: 'https://github.com/org/repo/pull/123',
    title: 'PR #123',
    isActive: true,
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuesService,
        {
          provide: getRepositoryToken(Issue),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RemoteLink),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IssuesService>(IssuesService);
    issueRepository = module.get<Repository<Issue>>(getRepositoryToken(Issue));
    remoteLinkRepository = module.get<Repository<RemoteLink>>(getRepositoryToken(RemoteLink));
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== TESTS DE BASE ====================

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have all repositories injected', () => {
      expect(issueRepository).toBeDefined();
      expect(remoteLinkRepository).toBeDefined();
      expect(projectRepository).toBeDefined();
    });
  });

  // ==================== TESTS CRUD ====================

  describe('findOne', () => {
    it('should return an issue when found', async () => {
      jest.spyOn(issueRepository, 'findOne').mockResolvedValue(mockIssue as Issue);

      const result = await service.findOne('1');

      expect(result).toEqual(mockIssue);
      expect(issueRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['project', 'reporter', 'assignee', 'labels', 'subtasks'],
      });
    });

    it('should throw NotFoundException when issue not found', async () => {
      jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Issue with ID 999 not found');
    });
  });

  describe('findByKey', () => {
    it('should return an issue by its key', async () => {
      jest.spyOn(issueRepository, 'findOne').mockResolvedValue(mockIssue as Issue);

      const result = await service.findByKey('TEST-1');

      expect(result).toEqual(mockIssue);
      expect(issueRepository.findOne).toHaveBeenCalledWith({
        where: { issueKey: 'TEST-1' },
        relations: ['project', 'reporter', 'assignee', 'labels', 'subtasks'],
      });
    });

    it('should throw NotFoundException when issue key not found', async () => {
      jest.spyOn(issueRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findByKey('NONEXISTENT-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      projectId: '1',
      summary: 'New Issue',
      description: 'New Description',
      issueType: 'Bug',
      reporterId: '1',
    };

    it('should create a new issue successfully', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject as Project);
      jest.spyOn(issueRepository, 'count').mockResolvedValue(0);
      jest.spyOn(issueRepository, 'create').mockReturnValue({
        ...createDto,
        issueKey: 'TEST-1',
        status: 'Open',
        priority: 'Medium',
      } as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        id: '2',
        ...createDto,
        issueKey: 'TEST-1',
      } as Issue);

      const result = await service.create(createDto);

      expect(result.issueKey).toBe('TEST-1');
      expect(projectRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(issueRepository.count).toHaveBeenCalledWith({ where: { projectId: '1' } });
    });

    it('should throw BadRequestException when project not found', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(createDto)).rejects.toThrow('Project with ID 1 not found');
    });

    it('should generate correct issue key based on project', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject as Project);
      jest.spyOn(issueRepository, 'count').mockResolvedValue(5); // 5 issues exist
      jest.spyOn(issueRepository, 'create').mockReturnValue({} as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        issueKey: 'TEST-6',
      } as Issue);

      const result = await service.create(createDto);

      expect(issueRepository.count).toHaveBeenCalled();
      // Next issue should be TEST-6 (5 + 1)
    });
  });

  describe('update', () => {
    const updateDto = {
      summary: 'Updated Summary',
      status: 'Resolved',
    };

    it('should update an issue successfully', async () => {
      const existingIssue = { ...mockIssue };
      jest.spyOn(service, 'findOne').mockResolvedValue(existingIssue as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        ...existingIssue,
        ...updateDto,
        resolvedAt: new Date(),
      } as Issue);

      const result = await service.update('1', updateDto);

      expect(result.summary).toBe('Updated Summary');
      expect(result.status).toBe('Resolved');
      expect(issueRepository.save).toHaveBeenCalled();
    });

    it('should set resolvedAt when status changes to Resolved', async () => {
      const existingIssue = { ...mockIssue, resolvedAt: null };
      jest.spyOn(service, 'findOne').mockResolvedValue(existingIssue as Issue);

      const savedIssue = { ...existingIssue, ...updateDto };
      jest.spyOn(issueRepository, 'save').mockImplementation(async (issue) => {
        return { ...issue, resolvedAt: new Date() } as Issue;
      });

      const result = await service.update('1', { status: 'Resolved' });

      expect(result.resolvedAt).toBeDefined();
    });

    it('should clear resolvedAt when status changes from Resolved', async () => {
      const existingIssue = {
        ...mockIssue,
        status: 'Resolved',
        resolvedAt: new Date()
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(existingIssue as Issue);
      jest.spyOn(issueRepository, 'save').mockImplementation(async (issue) => {
        return { ...issue, resolvedAt: null } as Issue;
      });

      const result = await service.update('1', { status: 'Open' });

      expect(result.resolvedAt).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an issue successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(issueRepository, 'remove').mockResolvedValue(mockIssue as Issue);

      await service.remove('1');

      expect(service.findOne).toHaveBeenCalledWith('1');
      expect(issueRepository.remove).toHaveBeenCalledWith(mockIssue);
    });

    it('should throw NotFoundException when trying to remove non-existent issue', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== TESTS BULK OPERATIONS ====================

  describe('createBulk', () => {
    it('should create multiple issues successfully', async () => {
      const bulkDtos = [
        { projectId: '1', summary: 'Issue 1', issueType: 'Task', reporterId: '1' },
        { projectId: '1', summary: 'Issue 2', issueType: 'Bug', reporterId: '1' },
      ];

      jest.spyOn(service, 'create')
        .mockResolvedValueOnce({ id: '1', summary: 'Issue 1' } as Issue)
        .mockResolvedValueOnce({ id: '2', summary: 'Issue 2' } as Issue);

      const result = await service.createBulk(bulkDtos);

      expect(result).toHaveLength(2);
      expect(service.create).toHaveBeenCalledTimes(2);
    });

    it('should continue on error and return successful issues', async () => {
      const bulkDtos = [
        { projectId: '1', summary: 'Issue 1', issueType: 'Task', reporterId: '1' },
        { projectId: '999', summary: 'Issue 2', issueType: 'Bug', reporterId: '1' }, // Will fail
      ];

      jest.spyOn(service, 'create')
        .mockResolvedValueOnce({ id: '1', summary: 'Issue 1' } as Issue)
        .mockRejectedValueOnce(new BadRequestException('Project not found'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await service.createBulk(bulkDtos);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('updateBulk', () => {
    it('should update multiple issues successfully', async () => {
      const issueIds = ['1', '2', '3'];
      const updates = { status: 'Resolved' };

      jest.spyOn(service, 'update')
        .mockResolvedValueOnce({ id: '1', status: 'Resolved' } as Issue)
        .mockResolvedValueOnce({ id: '2', status: 'Resolved' } as Issue)
        .mockResolvedValueOnce({ id: '3', status: 'Resolved' } as Issue);

      const result = await service.updateBulk(issueIds, updates);

      expect(result).toHaveLength(3);
      expect(service.update).toHaveBeenCalledTimes(3);
      expect(result.every(issue => issue.status === 'Resolved')).toBe(true);
    });
  });

  // ==================== TESTS ACTIONS ====================

  describe('assignIssue', () => {
    it('should assign issue to user', async () => {
      jest.spyOn(service, 'update').mockResolvedValue({
        ...mockIssue,
        assigneeId: '5',
      } as Issue);

      const result = await service.assignIssue('1', '5');

      expect(service.update).toHaveBeenCalledWith('1', { assigneeId: '5' });
      expect(result.assigneeId).toBe('5');
    });
  });

  describe('moveIssue', () => {
    const targetProject: Partial<Project> = {
      id: '2',
      projectKey: 'MOVED',
      name: 'Target Project',
    };

    it('should move issue to another project', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(targetProject as Project);
      jest.spyOn(issueRepository, 'count').mockResolvedValue(0);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        ...mockIssue,
        projectId: '2',
        issueKey: 'MOVED-1',
      } as Issue);

      const result = await service.moveIssue('1', '2');

      expect(result.projectId).toBe('2');
      expect(result.issueKey).toBe('MOVED-1');
    });

    it('should throw NotFoundException when target project not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);

      await expect(service.moveIssue('1', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cloneIssue', () => {
    it('should clone an issue with custom summary', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(service, 'create').mockResolvedValue({
        ...mockIssue,
        id: '2',
        issueKey: 'TEST-2',
        summary: 'Cloned Issue',
      } as Issue);

      const result = await service.cloneIssue('1', 'Cloned Issue');

      expect(result.summary).toBe('Cloned Issue');
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: 'Cloned Issue',
          description: mockIssue.description,
          issueType: mockIssue.issueType,
        })
      );
    });

    it('should clone with default [CLONE] prefix', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(service, 'create').mockResolvedValue({
        ...mockIssue,
        id: '2',
        summary: '[CLONE] Test Issue',
      } as Issue);

      const result = await service.cloneIssue('1');

      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          summary: '[CLONE] Test Issue',
        })
      );
    });
  });

  describe('archiveIssue and restoreIssue', () => {
    it('should archive an issue', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        ...mockIssue,
        status: 'Archived',
      } as Issue);

      const result = await service.archiveIssue('1');

      expect(result.status).toBe('Archived');
    });

    it('should restore an archived issue', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        ...mockIssue,
        status: 'Archived',
      } as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        ...mockIssue,
        status: 'Open',
      } as Issue);

      const result = await service.restoreIssue('1');

      expect(result.status).toBe('Open');
    });
  });

  // ==================== TESTS SUBTASKS ====================

  describe('getSubtasks', () => {
    it('should return all subtasks of an issue', async () => {
      const subtasks = [
        { id: '2', parentId: '1', summary: 'Subtask 1' },
        { id: '3', parentId: '1', summary: 'Subtask 2' },
      ];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(issueRepository, 'find').mockResolvedValue(subtasks as Issue[]);

      const result = await service.getSubtasks('1');

      expect(result).toHaveLength(2);
      expect(issueRepository.find).toHaveBeenCalledWith({
        where: { parentId: '1' },
        relations: ['project', 'reporter', 'assignee', 'labels'],
        order: { createdAt: 'ASC' },
      });
    });
  });

  describe('createSubtask', () => {
    const subtaskDto = {
      projectId: '1',
      summary: 'Subtask',
      issueType: 'Sub-task',
      reporterId: '1',
    };

    it('should create a subtask linked to parent', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(service, 'create').mockResolvedValue({
        id: '2',
        ...subtaskDto,
        issueKey: 'TEST-2',
      } as Issue);
      jest.spyOn(issueRepository, 'save').mockResolvedValue({
        id: '2',
        parentId: '1',
        ...subtaskDto,
      } as Issue);

      const result = await service.createSubtask('1', subtaskDto);

      expect(result.parentId).toBe('1');
      expect(service.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: mockIssue.projectId,
          issueType: 'Sub-task',
        })
      );
    });
  });

  // ==================== TESTS REMOTE LINKS ====================

  describe('getRemoteLinks', () => {
    it('should return all active remote links', async () => {
      const links = [mockRemoteLink, { ...mockRemoteLink, id: '2' }];

      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(remoteLinkRepository, 'find').mockResolvedValue(links as RemoteLink[]);

      const result = await service.getRemoteLinks('1');

      expect(result).toHaveLength(2);
      expect(remoteLinkRepository.find).toHaveBeenCalledWith({
        where: { issueId: '1', isActive: true },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('addRemoteLink', () => {
    it('should add a remote link to an issue', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(remoteLinkRepository, 'create').mockReturnValue(mockRemoteLink as RemoteLink);
      jest.spyOn(remoteLinkRepository, 'save').mockResolvedValue(mockRemoteLink as RemoteLink);

      const result = await service.addRemoteLink('1', 'https://github.com/test', 'Test Link');

      expect(result.url).toBe(mockRemoteLink.url);
      expect(result.title).toBe(mockRemoteLink.title);
      expect(remoteLinkRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          issueId: '1',
          url: 'https://github.com/test',
          title: 'Test Link',
          isActive: true,
        })
      );
    });
  });

  describe('removeRemoteLink', () => {
    it('should remove a remote link', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(remoteLinkRepository, 'findOne').mockResolvedValue(mockRemoteLink as RemoteLink);
      jest.spyOn(remoteLinkRepository, 'remove').mockResolvedValue(mockRemoteLink as RemoteLink);

      await service.removeRemoteLink('1', '1');

      expect(remoteLinkRepository.remove).toHaveBeenCalledWith(mockRemoteLink);
    });

    it('should throw NotFoundException when link not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);
      jest.spyOn(remoteLinkRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeRemoteLink('1', '999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== TESTS METADATA ====================

  describe('getEditMeta', () => {
    it('should return field metadata for editing', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockIssue as Issue);

      const result = await service.getEditMeta('1');

      expect(result).toHaveProperty('fields');
      expect(result.fields).toHaveProperty('summary');
      expect(result.fields).toHaveProperty('description');
      expect(result.fields).toHaveProperty('status');
      expect(result.fields.summary.required).toBe(true);
      expect(result.fields.summary.type).toBe('string');
    });
  });

  describe('getCreateMeta', () => {
    it('should return field metadata for creation', async () => {
      const result = await service.getCreateMeta();

      expect(result).toHaveProperty('fields');
      expect(result.fields.summary.required).toBe(true);
      expect(result.fields.priority.defaultValue).toBe('Medium');
    });

    it('should include project info when projectId provided', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(mockProject as Project);

      const result = await service.getCreateMeta('1');

      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].id).toBe('1');
    });
  });

  describe('getPickerSuggestions', () => {
    it('should return issue suggestions based on query', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockIssue]),
      };

      jest.spyOn(issueRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.getPickerSuggestions('test');

      expect(result).toHaveProperty('sections');
      expect(result.sections[0].issues).toHaveLength(1);
      expect(result.sections[0].issues[0].key).toBe('TEST-1');
    });

    it('should exclude current issue from suggestions', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      jest.spyOn(issueRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      await service.getPickerSuggestions('test', 'TEST-1');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'issue.issueKey != :currentIssueKey',
        { currentIssueKey: 'TEST-1' }
      );
    });
  });
});
