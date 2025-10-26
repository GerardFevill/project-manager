import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TasksService } from './tasks-enhanced.service';
import { Task } from './entities/task.entity';
import { TaskHistory } from './entities/task-history.entity';
import { TaskStatus } from './enums/task-status.enum';
import { TaskRecurrence } from './enums/task-recurrence.enum';
import { CreateTaskDto } from './dto/create-task-enhanced.dto';
import { UpdateTaskDto } from './dto/update-task-enhanced.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let historyRepository: Repository<TaskHistory>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockHistoryRepository = {
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(TaskHistory),
          useValue: mockHistoryRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    historyRepository = module.get<Repository<TaskHistory>>(
      getRepositoryToken(TaskHistory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a root task (level 0)', async () => {
      const createDto: CreateTaskDto = {
        title: 'Root Task',
        description: 'Test description',
        status: TaskStatus.ACTIVE,
        priority: 'high',
      };

      const mockTask = {
        id: 'uuid-1',
        ...createDto,
        level: 0,
        progress: 0,
        recurrence: TaskRecurrence.NONE,
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);
      mockHistoryRepository.save.mockResolvedValue({});

      const result = await service.create(createDto);

      expect(result.level).toBe(0);
      expect(result.title).toBe('Root Task');
      expect(mockTaskRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(mockHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'uuid-1',
          action: 'created',
        }),
      );
    });

    it('should create a child task with correct level', async () => {
      const parentTask = {
        id: 'parent-uuid',
        title: 'Parent',
        level: 0,
      };

      const createDto: CreateTaskDto = {
        title: 'Child Task',
        parentId: 'parent-uuid',
      };

      const mockChildTask = {
        id: 'child-uuid',
        ...createDto,
        level: 1,
      };

      mockTaskRepository.findOne.mockResolvedValue(parentTask);
      mockTaskRepository.create.mockReturnValue(mockChildTask);
      mockTaskRepository.save.mockResolvedValue(mockChildTask);
      mockHistoryRepository.save.mockResolvedValue({});

      const result = await service.create(createDto);

      expect(result.level).toBe(1);
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'parent-uuid' },
      });
    });

    it('should handle recurrence setup', async () => {
      const createDto: CreateTaskDto = {
        title: 'Recurring Task',
        recurrence: TaskRecurrence.WEEKLY,
        nextOccurrence: '2025-11-01T10:00:00Z',
      };

      const mockTask = {
        id: 'uuid-recurring',
        ...createDto,
        status: TaskStatus.RECURRING,
      };

      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);
      mockHistoryRepository.save.mockResolvedValue({});

      const result = await service.create(createDto);

      expect(result.recurrence).toBe(TaskRecurrence.WEEKLY);
      expect(result.status).toBe(TaskStatus.RECURRING);
    });

    it('should throw NotFoundException if parent does not exist', async () => {
      const createDto: CreateTaskDto = {
        title: 'Orphan Task',
        parentId: 'non-existent-uuid',
      };

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const mockTask = {
        id: 'uuid-1',
        title: 'Test Task',
        status: TaskStatus.ACTIVE,
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should include relations when requested', async () => {
      const mockTask = {
        id: 'uuid-1',
        title: 'Test Task',
        parent: { id: 'parent-uuid' },
        children: [{ id: 'child-uuid' }],
      };

      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne('uuid-1', true);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        relations: ['parent', 'children', 'history'],
      });
    });
  });

  describe('findAll with filters', () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    beforeEach(() => {
      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return all tasks without filters', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockTasks);

      const result = await service.findAll();

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.createQueryBuilder).toHaveBeenCalledWith(
        'task',
      );
    });

    it('should filter by status', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ status: TaskStatus.ACTIVE });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        { status: TaskStatus.ACTIVE },
      );
    });

    it('should filter by priority', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ priority: 'high' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.priority = :priority',
        { priority: 'high' },
      );
    });

    it('should filter only root tasks', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ onlyRoot: true });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.level = 0',
      );
    });

    it('should filter overdue tasks', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ onlyOverdue: true });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.dueDate < :now',
        expect.any(Object),
      );
    });

    it('should apply pagination', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll({ page: 2, limit: 10 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const existingTask = {
        id: 'uuid-1',
        title: 'Old Title',
        status: TaskStatus.DRAFT,
        progress: 0,
      };

      const updateDto: UpdateTaskDto = {
        title: 'New Title',
        status: TaskStatus.ACTIVE,
        progress: 50,
      };

      const updatedTask = {
        ...existingTask,
        ...updateDto,
      };

      mockTaskRepository.findOne.mockResolvedValue(existingTask);
      mockTaskRepository.save.mockResolvedValue(updatedTask);
      mockHistoryRepository.save.mockResolvedValue({});

      const result = await service.update('uuid-1', updateDto);

      expect(result.title).toBe('New Title');
      expect(result.status).toBe(TaskStatus.ACTIVE);
      expect(result.progress).toBe(50);
      expect(mockHistoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { title: 'New' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should recalculate levels when parent changes', async () => {
      const existingTask = {
        id: 'uuid-1',
        title: 'Task',
        level: 0,
        parentId: null,
        children: [],
      };

      const newParent = {
        id: 'new-parent',
        level: 1,
      };

      const updateDto: UpdateTaskDto = {
        parentId: 'new-parent',
      };

      mockTaskRepository.findOne
        .mockResolvedValueOnce(existingTask)
        .mockResolvedValueOnce(newParent);
      mockTaskRepository.save.mockResolvedValue({
        ...existingTask,
        level: 2,
        parentId: 'new-parent',
      });
      mockHistoryRepository.save.mockResolvedValue({});

      const result = await service.update('uuid-1', updateDto);

      expect(result.level).toBe(2);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle from ACTIVE to COMPLETED', async () => {
      const task = {
        id: 'uuid-1',
        status: TaskStatus.ACTIVE,
        toggleCompletion: jest.fn(),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        status: TaskStatus.COMPLETED,
      });
      mockHistoryRepository.save.mockResolvedValue({});

      await service.toggleCompletion('uuid-1');

      expect(task.toggleCompletion).toHaveBeenCalled();
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });

    it('should toggle from COMPLETED to ACTIVE', async () => {
      const task = {
        id: 'uuid-1',
        status: TaskStatus.COMPLETED,
        toggleCompletion: jest.fn(),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        status: TaskStatus.ACTIVE,
      });
      mockHistoryRepository.save.mockResolvedValue({});

      await service.toggleCompletion('uuid-1');

      expect(task.toggleCompletion).toHaveBeenCalled();
    });
  });

  describe('blockTask', () => {
    it('should block a task with reason', async () => {
      const task = {
        id: 'uuid-1',
        status: TaskStatus.ACTIVE,
        block: jest.fn(),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        status: TaskStatus.BLOCKED,
      });
      mockHistoryRepository.save.mockResolvedValue({});

      await service.blockTask('uuid-1', 'Waiting for approval');

      expect(task.block).toHaveBeenCalledWith('Waiting for approval');
      expect(mockHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'blocked',
          metadata: expect.objectContaining({
            reason: 'Waiting for approval',
          }),
        }),
      );
    });
  });

  describe('archiveTask', () => {
    it('should archive a task (soft delete)', async () => {
      const task = {
        id: 'uuid-1',
        status: TaskStatus.COMPLETED,
        archive: jest.fn(),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        status: TaskStatus.ARCHIVED,
        deletedAt: new Date(),
      });
      mockHistoryRepository.save.mockResolvedValue({});

      await service.archiveTask('uuid-1');

      expect(task.archive).toHaveBeenCalled();
      expect(mockHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'archived',
        }),
      );
    });
  });

  describe('moveToNextOccurrence', () => {
    it('should calculate next occurrence for daily recurrence', async () => {
      const task = {
        id: 'uuid-1',
        recurrence: TaskRecurrence.DAILY,
        nextOccurrence: new Date('2025-10-26'),
        moveToNextOccurrence: jest.fn(),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.save.mockResolvedValue({
        ...task,
        nextOccurrence: new Date('2025-10-27'),
      });
      mockHistoryRepository.save.mockResolvedValue({});

      await service.moveToNextOccurrence('uuid-1');

      expect(task.moveToNextOccurrence).toHaveBeenCalled();
    });

    it('should throw error for non-recurring tasks', async () => {
      const task = {
        id: 'uuid-1',
        recurrence: TaskRecurrence.NONE,
      };

      mockTaskRepository.findOne.mockResolvedValue(task);

      await expect(service.moveToNextOccurrence('uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getStatistics', () => {
    it('should return complete statistics', async () => {
      mockTaskRepository.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(30) // draft
        .mockResolvedValueOnce(40) // active
        .mockResolvedValueOnce(20) // completed
        .mockResolvedValueOnce(5) // blocked
        .mockResolvedValueOnce(3) // recurring
        .mockResolvedValueOnce(2) // archived
        .mockResolvedValueOnce(8); // overdue

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ avg: '65.5' }),
      };

      mockTaskRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getStatistics();

      expect(result.total).toBe(100);
      expect(result.byStatus.draft).toBe(30);
      expect(result.byStatus.active).toBe(40);
      expect(result.byStatus.completed).toBe(20);
      expect(result.completionRate).toBe(20);
      expect(result.overdue).toBe(8);
    });
  });

  describe('findChildren', () => {
    it('should return direct children of a task', async () => {
      const children = [
        { id: 'child-1', title: 'Child 1' },
        { id: 'child-2', title: 'Child 2' },
      ];

      mockTaskRepository.find.mockResolvedValue(children);

      const result = await service.findChildren('parent-uuid');

      expect(result).toEqual(children);
      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { parentId: 'parent-uuid' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a task and create history entry', async () => {
      const task = {
        id: 'uuid-1',
        title: 'Task to delete',
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockHistoryRepository.save.mockResolvedValue({});
      mockTaskRepository.remove.mockResolvedValue(task);

      await service.remove('uuid-1');

      expect(mockHistoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'deleted',
        }),
      );
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
