import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects.service';
import { Project } from '../entities/project.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

/**
 * Tests unitaires complets pour ProjectsService
 *
 * Couverture:
 * - CRUD de base (findAll, findOne, findByKey, create, update, remove)
 * - Opérations d'archivage (archive, unarchive)
 * - Gestion des utilisateurs et rôles
 * - Configuration du projet (schemes, features)
 * - Recherche et métadonnées
 * - Validation
 */
describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<Project>;

  // Mock repository avec toutes les méthodes nécessaires
  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // Données de test
  const mockProject: Project = {
    id: '1',
    projectKey: 'TEST',
    projectName: 'Test Project',
    description: 'Test Description',
    leadUserId: 'user1',
    projectTypeKey: 'software',
    isArchived: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lead: null,
    issues: [],
    components: [],
    versions: [],
    boards: [],
  };

  const mockProjects = [
    mockProject,
    {
      ...mockProject,
      id: '2',
      projectKey: 'TEST2',
      projectName: 'Test Project 2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have projectRepository injected', () => {
      expect(projectRepository).toBeDefined();
    });
  });

  // ==================== CRUD DE BASE ====================

  describe('findAll', () => {
    it('should return paginated projects with relations', async () => {
      const page = 1;
      const limit = 10;
      const total = 25;

      mockRepository.findAndCount.mockResolvedValue([mockProjects, total]);

      const result = await service.findAll(page, limit);

      expect(result).toEqual({
        data: mockProjects,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['lead'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle default pagination parameters', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockProjects, 2]);

      await service.findAll();

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['lead'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should calculate lastPage correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockProjects, 23]);

      const result = await service.findAll(1, 10);

      expect(result.lastPage).toBe(3); // 23 / 10 = 2.3 -> ceil = 3
    });
  });

  describe('findOne', () => {
    it('should return a project by id with relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProject);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['lead'],
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('Project with ID 999 not found');
    });
  });

  describe('findByKey', () => {
    it('should return a project by key with relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.findByKey('TEST');

      expect(result).toEqual(mockProject);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { projectKey: 'TEST' },
        relations: ['lead'],
      });
    });

    it('should throw NotFoundException if project key not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByKey('NOTFOUND')).rejects.toThrow(NotFoundException);
      await expect(service.findByKey('NOTFOUND')).rejects.toThrow('Project with key NOTFOUND not found');
    });
  });

  describe('create', () => {
    const createDto = {
      projectKey: 'NEW',
      projectName: 'New Project',
      description: 'New Description',
      leadUserId: 'user1',
      projectTypeKey: 'software',
    };

    it('should create a new project successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null); // No existing project
      mockRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...mockProject, ...createDto });

      const result = await service.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { projectKey: createDto.projectKey },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        isArchived: false,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.projectKey).toBe(createDto.projectKey);
    });

    it('should throw ConflictException if project key already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject); // Existing project

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow(
        `Project with key ${createDto.projectKey} already exists`
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should set isArchived to false by default', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createDto, id: '1' });
      mockRepository.save.mockResolvedValue({ ...mockProject, ...createDto, isArchived: false });

      const result = await service.create(createDto);

      expect(result.isArchived).toBe(false);
    });
  });

  describe('update', () => {
    const updateDto = {
      projectName: 'Updated Name',
      description: 'Updated Description',
    };

    it('should update a project successfully', async () => {
      const updatedProject = { ...mockProject, ...updateDto };
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue(updatedProject);

      const result = await service.update('1', updateDto);

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockProject,
          ...updateDto,
          updatedAt: expect.any(Date),
        })
      );
      expect(result.projectName).toBe(updateDto.projectName);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should update project without checking key', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, ...updateDto });

      await service.update('1', updateDto);

      // findOne should only be called once (for findOne method, not for duplicate check)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a project successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.remove.mockResolvedValue(mockProject);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockProject);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('archive', () => {
    it('should archive a project successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);
      mockRepository.save.mockResolvedValue({ ...mockProject, isArchived: true });

      const result = await service.archive('1');

      expect(result.isArchived).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isArchived: true,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.archive('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('unarchive', () => {
    it('should unarchive a project successfully', async () => {
      const archivedProject = { ...mockProject, isArchived: true };
      mockRepository.findOne.mockResolvedValue(archivedProject);
      mockRepository.save.mockResolvedValue({ ...archivedProject, isArchived: false });

      const result = await service.unarchive('1');

      expect(result.isArchived).toBe(false);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          isArchived: false,
          updatedAt: expect.any(Date),
        })
      );
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.unarchive('999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== UTILISATEURS & RÔLES ====================

  describe('getProjectUsers', () => {
    it('should return project users structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectUsers('1');

      expect(result).toEqual({
        projectId: '1',
        projectKey: 'TEST',
        users: [],
      });
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectUsers('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRoleActors', () => {
    it('should return role actors structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getRoleActors('1', 'role1');

      expect(result).toEqual({
        projectId: '1',
        roleId: 'role1',
        actors: [],
      });
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getRoleActors('999', 'role1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addRoleActor', () => {
    const actorData = { actorId: 'user1', actorType: 'user' as const };

    it('should add role actor successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.addRoleActor('1', 'role1', actorData);

      expect(result).toEqual({
        projectId: '1',
        roleId: 'role1',
        actor: {
          ...actorData,
          addedAt: expect.any(Date),
        },
      });
      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.addRoleActor('999', 'role1', actorData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeRoleActor', () => {
    it('should verify project exists when removing role actor', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      await service.removeRoleActor('1', 'role1', 'actor1');

      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeRoleActor('999', 'role1', 'actor1')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== CONFIGURATION DU PROJET ====================

  describe('getIssueSecurityLevelScheme', () => {
    it('should return issue security scheme structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getIssueSecurityLevelScheme('1');

      expect(result).toEqual({
        projectId: '1',
        scheme: null,
        defaultLevel: null,
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getIssueSecurityLevelScheme('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNotificationScheme', () => {
    it('should return notification scheme structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getNotificationScheme('1');

      expect(result).toEqual({
        projectId: '1',
        schemeId: null,
        schemeName: 'Default Notification Scheme',
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getNotificationScheme('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPermissionScheme', () => {
    it('should return permission scheme structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getPermissionScheme('1');

      expect(result).toEqual({
        projectId: '1',
        schemeId: null,
        schemeName: 'Default Permission Scheme',
        permissions: [],
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getPermissionScheme('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProjectFeatures', () => {
    it('should return project features with Jira standard features', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectFeatures('1');

      expect(result).toEqual({
        projectId: '1',
        features: {
          boards: { enabled: true },
          sprints: { enabled: true },
          backlog: { enabled: true },
          reports: { enabled: true },
          pages: { enabled: false },
          roadmap: { enabled: true },
          releases: { enabled: true },
        },
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectFeatures('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProjectFeatures', () => {
    const features = {
      boards: { enabled: false },
      sprints: { enabled: true },
    };

    it('should update project features', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.updateProjectFeatures('1', features);

      expect(result).toEqual({
        projectId: '1',
        features,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateProjectFeatures('999', features)).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== RECHERCHE & MÉTADONNÉES ====================

  describe('searchProjects', () => {
    it('should search projects by name, key, or description', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockProjects),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.searchProjects('test');

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('project');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('project.projectName LIKE :query', { query: '%test%' });
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(2);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('project.lead', 'lead');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('project.projectName', 'ASC');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result).toEqual(mockProjects);
    });

    it('should limit results to 20 projects', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.searchProjects('query');

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('getProjectAvatar', () => {
    it('should return project avatar structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectAvatar('1');

      expect(result).toEqual({
        projectId: '1',
        avatarUrl: null,
        avatarType: 'default',
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectAvatar('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadProjectAvatar', () => {
    const avatarData = { url: 'https://example.com/avatar.png' };

    it('should upload project avatar', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.uploadProjectAvatar('1', avatarData);

      expect(result).toEqual({
        projectId: '1',
        avatarUrl: avatarData.url,
        uploadedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadProjectAvatar('999', avatarData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProjectHierarchy', () => {
    it('should return project hierarchy with Epic/Story/Task/Sub-task levels', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectHierarchy('1');

      expect(result).toEqual({
        projectId: '1',
        projectKey: 'TEST',
        hierarchy: [
          { level: 0, type: 'Epic', enabled: true },
          { level: 1, type: 'Story', enabled: true },
          { level: 2, type: 'Task', enabled: true },
          { level: 3, type: 'Sub-task', enabled: true },
        ],
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectHierarchy('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProjectInsights', () => {
    it('should return project insights with statistics', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.getProjectInsights('1');

      expect(result).toEqual({
        projectId: '1',
        projectKey: 'TEST',
        insights: {
          totalIssues: 0,
          openIssues: 0,
          inProgressIssues: 0,
          resolvedIssues: 0,
          closedIssues: 0,
          averageResolutionTime: 0,
          activeUsers: 0,
          lastActivity: null,
        },
        calculatedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getProjectInsights('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateProject', () => {
    it('should validate a correct project with no errors', async () => {
      mockRepository.findOne.mockResolvedValue(mockProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should detect missing project name', async () => {
      const invalidProject = { ...mockProject, projectName: '' };
      mockRepository.findOne.mockResolvedValue(invalidProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Project name is required');
    });

    it('should detect missing project key', async () => {
      const invalidProject = { ...mockProject, projectKey: '' };
      mockRepository.findOne.mockResolvedValue(invalidProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Project key is required');
    });

    it('should detect invalid project key format', async () => {
      const invalidProject = { ...mockProject, projectKey: 'invalid-key' };
      mockRepository.findOne.mockResolvedValue(invalidProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Project key must start with a letter and contain only uppercase letters and numbers');
    });

    it('should warn if project has no lead', async () => {
      const projectWithoutLead = { ...mockProject, leadUserId: null };
      mockRepository.findOne.mockResolvedValue(projectWithoutLead);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(true); // warnings don't affect validity
      expect(result.warnings).toContain('Project has no lead assigned');
    });

    it('should warn if project is archived', async () => {
      const archivedProject = { ...mockProject, isArchived: true };
      mockRepository.findOne.mockResolvedValue(archivedProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(true); // warnings don't affect validity
      expect(result.warnings).toContain('Project is archived');
    });

    it('should accept valid project key formats', async () => {
      const validKeys = ['A', 'AB', 'ABC', 'A1', 'ABC123', 'PROJECT'];

      for (const key of validKeys) {
        const validProject = { ...mockProject, projectKey: key };
        mockRepository.findOne.mockResolvedValue(validProject);

        const result = await service.validateProject('1');

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      }
    });

    it('should detect multiple errors and warnings', async () => {
      const invalidProject = {
        ...mockProject,
        projectName: '',
        projectKey: 'invalid',
        leadUserId: null,
        isArchived: true,
      };
      mockRepository.findOne.mockResolvedValue(invalidProject);

      const result = await service.validateProject('1');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.warnings.length).toBeGreaterThan(1);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.validateProject('999')).rejects.toThrow(NotFoundException);
    });
  });
});
