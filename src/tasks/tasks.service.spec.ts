import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    dueDate: new Date('2025-12-31'),
    priority: 'medium',
    level: 0,
    parentId: null,
    parent: null,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null,
    isOverdue: jest.fn().mockReturnValue(false),
    isRoot: jest.fn().mockReturnValue(true),
    toggle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a root task (level 0)', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 'high',
      };

      const createdTask = { ...mockTask, ...createTaskDto, level: 0 };

      mockRepository.create.mockReturnValue(createdTask);
      mockRepository.save.mockResolvedValue(createdTask);

      const result = await service.create(createTaskDto);

      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...createTaskDto,
        level: 0,
      }));
      expect(result.level).toBe(0);
    });

    it('should create a child task with correct level', async () => {
      const parentId = '123e4567-e89b-12d3-a456-426614174001';
      const parentTask = { ...mockTask, id: parentId, level: 1 };

      const createTaskDto: CreateTaskDto = {
        title: 'Child Task',
        parentId,
      };

      const childTask = {
        ...mockTask,
        ...createTaskDto,
        level: 2,
        parentId,
      };

      // Mock findOne pour le parent
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parentTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      mockRepository.create.mockReturnValue(childTask);
      mockRepository.save.mockResolvedValue(childTask);

      const result = await service.create(createTaskDto);

      expect(result.level).toBe(2);
      expect(result.parentId).toBe(parentId);
    });

    it('should throw NotFoundException if parent does not exist', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Orphan Task',
        parentId: 'non-existent-id',
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.create(createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks without filters', async () => {
      const tasks = [mockTask];

      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(tasks),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('task.createdAt', 'DESC');
    });

    it('should filter active tasks', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ status: 'active' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.completed = :completed',
        { completed: false },
      );
    });

    it('should filter completed tasks', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ status: 'completed' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.completed = :completed',
        { completed: true },
      );
    });

    it('should filter by priority', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ priority: 'urgent' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.priority = :priority',
        { priority: 'urgent' },
      );
    });

    it('should filter root tasks only', async () => {
      const mockQueryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask]),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ onlyRoot: true });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('task.parentId IS NULL');
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(mockTask.id);

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should include relations when requested', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findOne(mockTask.id, true);

      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('task.parent', 'parent');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('task.children', 'children');
    });
  });

  describe('findChildren', () => {
    it('should return children of a task', async () => {
      const parentId = mockTask.id;
      const children = [
        { ...mockTask, id: 'child-1', parentId, level: 1 },
        { ...mockTask, id: 'child-2', parentId, level: 1 },
      ];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.find.mockResolvedValue(children);

      const result = await service.findChildren(parentId);

      expect(repository.find).toHaveBeenCalledWith({
        where: { parentId },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(children);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(60)  // active
        .mockResolvedValueOnce(40); // completed

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(10), // overdue
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getStats();

      expect(result).toEqual({
        total: 100,
        active: 60,
        completed: 40,
        overdue: 10,
        completionRate: 40,
      });
    });

    it('should return 0% completion rate when no tasks', async () => {
      mockRepository.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getStats();

      expect(result.completionRate).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
        priority: 'urgent',
      };

      const updatedTask = { ...mockTask, ...updateDto };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, updateDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toBe(updateDto.title);
    });

    it('should update completedAt when completing task', async () => {
      const updateDto: UpdateTaskDto = { completed: true };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.save.mockResolvedValue({ ...mockTask, completed: true });

      await service.update(mockTask.id, updateDto);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          completed: true,
          completedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('toggle', () => {
    it('should toggle task completion status', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.save.mockResolvedValue({ ...mockTask, completed: true });

      await service.toggle(mockTask.id);

      expect(mockTask.toggle).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTask),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.remove(mockTask.id);

      expect(repository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
