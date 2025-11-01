import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Tests unitaires complets pour UsersService
 *
 * Couverture:
 * - CRUD de base (findAll, findOne, findByUsername, findByEmail, create, update, remove)
 * - Recherche & queries (searchWithQuery, searchAssignableMultiProject, userPicker)
 * - Relations (getUserGroups, getUserPermissions)
 * - Propriétés (getUserProperties, setUserProperty, deleteUserProperty)
 * - Avatar (getUserAvatar, uploadUserAvatar)
 * - Opérations en masse (getBulkUsers, getUserMigrationData, getUserByEmail)
 * - Validation & sécurité (validatePassword, calculatePasswordStrength, verifyCredentials)
 */
describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  // Mock bcrypt
  jest.mock('bcrypt');

  // Mock repository
  const mockRepository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  // Données de test
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    groups: [],
    assignedIssues: [],
    reportedIssues: [],
    watchedIssues: [],
    workLogs: [],
    comments: [],
    ledProjects: [],
  };

  const mockUsers = [
    mockUser,
    {
      ...mockUser,
      id: '2',
      username: 'testuser2',
      email: 'test2@example.com',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have userRepository injected', () => {
      expect(userRepository).toBeDefined();
    });
  });

  // ==================== CRUD DE BASE ====================

  describe('findAll', () => {
    it('should return paginated users with groups relations', async () => {
      const page = 1;
      const limit = 10;
      const total = 25;

      mockRepository.findAndCount.mockResolvedValue([mockUsers, total]);

      const result = await service.findAll(page, limit);

      expect(result).toEqual({
        data: mockUsers,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['groups'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle default pagination parameters', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      await service.findAll();

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        relations: ['groups'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should calculate lastPage correctly', async () => {
      mockRepository.findAndCount.mockResolvedValue([mockUsers, 23]);

      const result = await service.findAll(1, 10);

      expect(result.lastPage).toBe(3); // 23 / 10 = 2.3 -> ceil = 3
    });
  });

  describe('findOne', () => {
    it('should return a user by id with groups relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['groups'],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('999')).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username with relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        relations: ['groups'],
      });
    });

    it('should return null if username not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email with relations', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['groups'],
      });
    });

    it('should return null if email not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const createDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'Password123!',
      firstName: 'New',
      lastName: 'User',
    };

    it('should create a new user with hashed password', async () => {
      mockRepository.findOne.mockResolvedValue(null); // No existing user
      const hashedPassword = '$2b$10$hashedNewPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      mockRepository.create.mockReturnValue({ ...createDto, password: hashedPassword });
      mockRepository.save.mockResolvedValue({ ...mockUser, ...createDto, password: hashedPassword });

      const result = await service.create(createDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: createDto.username }, { email: createDto.email }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        username: createDto.username,
        email: createDto.email,
        password: hashedPassword,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(result.username).toBe(createDto.username);
    });

    it('should throw ConflictException if username already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser); // Existing user

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow('Username or email already exists');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const existingEmailUser = { ...mockUser, username: 'different' };
      mockRepository.findOne.mockResolvedValue(existingEmailUser);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('should set isActive to true by default', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
      mockRepository.create.mockReturnValue({ ...createDto, isActive: true });
      mockRepository.save.mockResolvedValue({ ...mockUser, ...createDto, isActive: true });

      const result = await service.create(createDto);

      expect(result.isActive).toBe(true);
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockUser,
          ...updateDto,
          updatedAt: expect.any(Date),
        })
      );
      expect(result.firstName).toBe(updateDto.firstName);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should check email uniqueness if being updated', async () => {
      const updateDtoWithEmail = { email: 'newemail@example.com' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // First call for findOne
        .mockResolvedValueOnce(null); // Second call for findByEmail
      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateDtoWithEmail });

      await service.update('1', updateDtoWithEmail);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw ConflictException if new email already exists', async () => {
      const existingUser = { ...mockUser, id: '2', email: 'existing@example.com' };
      const updateDtoWithEmail = { email: 'existing@example.com' };

      mockRepository.findOne
        .mockResolvedValueOnce(mockUser) // First call for findOne
        .mockResolvedValueOnce(existingUser); // Second call for findByEmail

      await expect(service.update('1', updateDtoWithEmail)).rejects.toThrow(ConflictException);
      await expect(service.update('1', updateDtoWithEmail)).rejects.toThrow('Email already exists');
    });

    it('should hash password if being updated', async () => {
      const updateDtoWithPassword = { password: 'NewPassword123!' };
      const hashedPassword = '$2b$10$hashedNewPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, password: hashedPassword });

      await service.update('1', updateDtoWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(updateDtoWithPassword.password, 10);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword,
        })
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });

  // ==================== RECHERCHE & QUERIES ====================

  describe('searchWithQuery', () => {
    it('should search users by multiple fields', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.searchWithQuery('test');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.username LIKE :query', { query: '%test%' });
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledTimes(3); // email, firstName, lastName
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.groups', 'groups');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('user.username', 'ASC');
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
      expect(result).toEqual({
        query: 'test',
        total: mockUsers.length,
        results: mockUsers,
      });
    });

    it('should limit results to 20 users', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.searchWithQuery('query');

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('searchAssignableMultiProject', () => {
    it('should return active users for multiple projects', async () => {
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.searchAssignableMultiProject('proj1,proj2');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['groups'],
        take: 50,
      });
      expect(result.projectIds).toEqual(['proj1', 'proj2']);
      expect(result.users).toHaveLength(2);
      expect(result.users[0]).toHaveProperty('displayName');
    });

    it('should format displayName correctly', async () => {
      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.searchAssignableMultiProject('proj1');

      expect(result.users[0].displayName).toBe('Test User');
    });

    it('should handle empty project IDs', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.searchAssignableMultiProject('');

      expect(result.projectIds).toEqual([]);
    });
  });

  describe('userPicker', () => {
    it('should return suggestions for active users', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.userPicker('test');

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.isActive = :isActive', { isActive: true });
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.suggestions).toHaveLength(2);
      expect(result.suggestions[0]).toHaveProperty('displayName');
      expect(result.suggestions[0]).toHaveProperty('name');
    });

    it('should limit results to 10 suggestions', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.userPicker('query');

      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  // ==================== RELATIONS ====================

  describe('getUserGroups', () => {
    it('should return user groups', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserGroups('1');

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        groups: [],
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserGroups('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserPermissions', () => {
    it('should return user permissions', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserPermissions('1');

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        permissions: expect.arrayContaining([
          expect.objectContaining({ key: 'BROWSE_PROJECTS' }),
          expect.objectContaining({ key: 'CREATE_ISSUES' }),
          expect.objectContaining({ key: 'EDIT_ISSUES' }),
        ]),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserPermissions('999')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== PROPRIÉTÉS ====================

  describe('getUserProperties', () => {
    it('should return user properties structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserProperties('1');

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        properties: {},
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserProperties('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('setUserProperty', () => {
    it('should set user property with timestamp', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.setUserProperty('1', 'theme', 'dark');

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        property: {
          key: 'theme',
          value: 'dark',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.setUserProperty('999', 'key', 'value')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUserProperty', () => {
    it('should verify user exists when deleting property', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await service.deleteUserProperty('1', 'theme');

      expect(mockRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteUserProperty('999', 'key')).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== AVATAR ====================

  describe('getUserAvatar', () => {
    it('should return user avatar structure', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserAvatar('1');

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        avatarUrl: null,
        avatarType: 'default',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserAvatar('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadUserAvatar', () => {
    const avatarData = { url: 'https://example.com/avatar.png' };

    it('should upload user avatar with timestamp', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.uploadUserAvatar('1', avatarData);

      expect(result).toEqual({
        userId: '1',
        username: mockUser.username,
        avatarUrl: avatarData.url,
        uploadedAt: expect.any(Date),
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.uploadUserAvatar('999', avatarData)).rejects.toThrow(NotFoundException);
    });
  });

  // ==================== OPÉRATIONS EN MASSE ====================

  describe('getBulkUsers', () => {
    it('should fetch multiple users by IDs', async () => {
      const mockQueryBuilder = {
        whereInIds: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getBulkUsers('1,2,3');

      expect(mockQueryBuilder.whereInIds).toHaveBeenCalledWith(['1', '2', '3']);
      expect(result.requestedIds).toEqual(['1', '2', '3']);
      expect(result.found).toBe(2);
      expect(result.users[0]).toHaveProperty('displayName');
    });

    it('should handle empty ID list', async () => {
      const mockQueryBuilder = {
        whereInIds: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getBulkUsers('');

      expect(result.requestedIds).toEqual([]);
    });

    it('should trim whitespace from IDs', async () => {
      const mockQueryBuilder = {
        whereInIds: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.getBulkUsers(' 1 , 2 , 3 ');

      expect(mockQueryBuilder.whereInIds).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });

  describe('getUserMigrationData', () => {
    it('should fetch migration data with full user details', async () => {
      const mockQueryBuilder = {
        whereInIds: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockUsers),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getUserMigrationData('1,2');

      expect(result.requestedIds).toEqual(['1', '2']);
      expect(result.found).toBe(2);
      expect(result.migrationData[0]).toHaveProperty('createdAt');
      expect(result.migrationData[0]).toHaveProperty('updatedAt');
      expect(result.migrationData[0]).toHaveProperty('groups');
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByEmail('test@example.com');

      expect(result.email).toBe('test@example.com');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('displayName');
      expect(result.user.displayName).toBe('Test User');
    });

    it('should throw NotFoundException if email not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserByEmail('notfound@example.com')).rejects.toThrow(NotFoundException);
      await expect(service.getUserByEmail('notfound@example.com')).rejects.toThrow(
        'User with email notfound@example.com not found'
      );
    });
  });

  // ==================== VALIDATION & SÉCURITÉ ====================

  describe('validatePassword', () => {
    it('should validate a strong password successfully', async () => {
      const result = await service.validatePassword('StrongP@ss123');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.strength).toBeGreaterThanOrEqual(3);
    });

    it('should detect password too short', async () => {
      const result = await service.validatePassword('Short1!');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should warn about missing uppercase', async () => {
      const result = await service.validatePassword('password123!');

      expect(result.warnings).toContain('Password should contain at least one uppercase letter');
    });

    it('should warn about missing lowercase', async () => {
      const result = await service.validatePassword('PASSWORD123!');

      expect(result.warnings).toContain('Password should contain at least one lowercase letter');
    });

    it('should warn about missing number', async () => {
      const result = await service.validatePassword('Password!');

      expect(result.warnings).toContain('Password should contain at least one number');
    });

    it('should warn about missing special character', async () => {
      const result = await service.validatePassword('Password123');

      expect(result.warnings).toContain('Password should contain at least one special character');
    });

    it('should detect same password as current when userId provided', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validatePassword('Password123!', '1');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('New password must be different from current password');
    });

    it('should calculate password strength correctly', async () => {
      const weakResult = await service.validatePassword('password');
      const mediumResult = await service.validatePassword('Password123');
      const strongResult = await service.validatePassword('StrongP@ss123');

      expect(weakResult.strength).toBeLessThan(mediumResult.strength);
      expect(mediumResult.strength).toBeLessThan(strongResult.strength);
      expect(strongResult.strength).toBeGreaterThanOrEqual(3);
    });

    it('should handle multiple errors and warnings', async () => {
      const result = await service.validatePassword('weak');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('verifyCredentials', () => {
    it('should return user when credentials are valid', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.verifyCredentials('testuser', 'password123');

      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
    });

    it('should return null when username not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.verifyCredentials('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.verifyCredentials('testuser', 'wrongpassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockUser.password);
    });
  });
});
