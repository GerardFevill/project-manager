import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks-enhanced.controller';
import { TasksService } from './tasks-enhanced.service';
import { CreateTaskDto } from './dto/create-task-enhanced.dto';
import { UpdateTaskDto } from './dto/update-task-enhanced.dto';
import { TaskFilterDto } from './dto/task-filter-enhanced.dto';
import { BlockTaskDto } from './dto/task-action.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TaskRecurrence } from './enums/task-recurrence.enum';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    toggleCompletion: jest.fn(),
    blockTask: jest.fn(),
    unblockTask: jest.fn(),
    archiveTask: jest.fn(),
    unarchiveTask: jest.fn(),
    moveToNextOccurrence: jest.fn(),
    calculateProgressFromChildren: jest.fn(),
    findChildren: jest.fn(),
    findTree: jest.fn(),
    findAncestors: jest.fn(),
    getStatistics: jest.fn(),
    getTaskProgress: jest.fn(),
    getTaskHistory: jest.fn(),
    getUpcomingRecurrences: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        status: TaskStatus.ACTIVE,
        priority: 'high',
      };

      const mockResult = {
        id: 'uuid-1',
        ...createDto,
        level: 0,
        progress: 0,
        recurrence: TaskRecurrence.NONE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all tasks without filters', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' },
      ];

      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll({});

      expect(result).toEqual(mockTasks);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should return filtered tasks', async () => {
      const filters: TaskFilterDto = {
        status: TaskStatus.ACTIVE,
        priority: 'high',
        onlyRoot: true,
        page: 1,
        limit: 20,
      };

      const mockTasks = [{ id: '1', title: 'Task 1', status: TaskStatus.ACTIVE }];

      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockTasks);
      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      const mockStats = {
        total: 100,
        byStatus: {
          draft: 20,
          active: 50,
          completed: 25,
          blocked: 3,
          recurring: 1,
          archived: 1,
        },
        byPriority: {
          low: 30,
          medium: 40,
          high: 25,
          urgent: 5,
        },
        overdue: 8,
        completionRate: 25,
        avgProgress: 62.5,
        upcomingRecurrences: 5,
      };

      mockTasksService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStats();

      expect(result).toEqual(mockStats);
      expect(service.getStatistics).toHaveBeenCalled();
    });
  });

  describe('getUpcomingRecurrences', () => {
    it('should return upcoming recurring tasks with default days', async () => {
      const mockTasks = [
        { id: '1', title: 'Daily standup', recurrence: TaskRecurrence.DAILY },
      ];

      mockTasksService.getUpcomingRecurrences.mockResolvedValue(mockTasks);

      const result = await controller.getUpcomingRecurrences('7');

      expect(result).toEqual(mockTasks);
      expect(service.getUpcomingRecurrences).toHaveBeenCalledWith(7);
    });

    it('should accept custom days parameter', async () => {
      mockTasksService.getUpcomingRecurrences.mockResolvedValue([]);

      await controller.getUpcomingRecurrences('30');

      expect(service.getUpcomingRecurrences).toHaveBeenCalledWith(30);
    });
  });

  describe('findOne', () => {
    it('should return a task by id without relations', async () => {
      const mockTask = {
        id: 'uuid-1',
        title: 'Test Task',
        status: TaskStatus.ACTIVE,
      };

      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('uuid-1', undefined);

      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('uuid-1', false);
    });

    it('should return a task with relations when requested', async () => {
      const mockTask = {
        id: 'uuid-1',
        title: 'Test Task',
        parent: { id: 'parent-id' },
        children: [{ id: 'child-id' }],
      };

      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne('uuid-1', 'true');

      expect(result).toEqual(mockTask);
      expect(service.findOne).toHaveBeenCalledWith('uuid-1', true);
    });
  });

  describe('findChildren', () => {
    it('should return direct children of a task', async () => {
      const mockChildren = [
        { id: 'child-1', title: 'Child 1' },
        { id: 'child-2', title: 'Child 2' },
      ];

      mockTasksService.findChildren.mockResolvedValue(mockChildren);

      const result = await controller.findChildren('parent-uuid');

      expect(result).toEqual(mockChildren);
      expect(service.findChildren).toHaveBeenCalledWith('parent-uuid');
    });
  });

  describe('findTree', () => {
    it('should return full task tree', async () => {
      const mockTree = {
        id: 'root',
        title: 'Root',
        children: [
          {
            id: 'child-1',
            title: 'Child 1',
            children: [],
          },
        ],
      };

      mockTasksService.findTree.mockResolvedValue(mockTree);

      const result = await controller.findTree('root');

      expect(result).toEqual(mockTree);
      expect(service.findTree).toHaveBeenCalledWith('root');
    });
  });

  describe('findAncestors', () => {
    it('should return all ancestors', async () => {
      const mockAncestors = [
        { id: 'grandparent', level: 0 },
        { id: 'parent', level: 1 },
      ];

      mockTasksService.findAncestors.mockResolvedValue(mockAncestors);

      const result = await controller.findAncestors('task-id');

      expect(result).toEqual(mockAncestors);
      expect(service.findAncestors).toHaveBeenCalledWith('task-id');
    });
  });

  describe('getTaskProgress', () => {
    it('should return task progress details', async () => {
      const mockProgress = {
        taskId: 'uuid-1',
        currentProgress: 75,
        childrenProgress: [
          { id: 'child-1', progress: 100 },
          { id: 'child-2', progress: 50 },
        ],
        timeline: [],
      };

      mockTasksService.getTaskProgress.mockResolvedValue(mockProgress);

      const result = await controller.getTaskProgress('uuid-1');

      expect(result).toEqual(mockProgress);
      expect(service.getTaskProgress).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('getTaskHistory', () => {
    it('should return task history', async () => {
      const mockHistory = [
        {
          id: 'history-1',
          action: 'created',
          executedAt: new Date(),
          statusAtExecution: TaskStatus.DRAFT,
        },
        {
          id: 'history-2',
          action: 'status_changed',
          executedAt: new Date(),
          statusAtExecution: TaskStatus.ACTIVE,
        },
      ];

      mockTasksService.getTaskHistory.mockResolvedValue(mockHistory);

      const result = await controller.getTaskHistory('uuid-1');

      expect(result).toEqual(mockHistory);
      expect(service.getTaskHistory).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated Title',
        progress: 80,
      };

      const mockUpdatedTask = {
        id: 'uuid-1',
        title: 'Updated Title',
        progress: 80,
      };

      mockTasksService.update.mockResolvedValue(mockUpdatedTask);

      const result = await controller.update('uuid-1', updateDto);

      expect(result).toEqual(mockUpdatedTask);
      expect(service.update).toHaveBeenCalledWith('uuid-1', updateDto);
    });
  });

  describe('toggleCompletion', () => {
    it('should toggle task completion', async () => {
      const mockTask = {
        id: 'uuid-1',
        status: TaskStatus.COMPLETED,
      };

      mockTasksService.toggleCompletion.mockResolvedValue(mockTask);

      const result = await controller.toggleCompletion('uuid-1');

      expect(result).toEqual(mockTask);
      expect(service.toggleCompletion).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('blockTask', () => {
    it('should block a task with reason', async () => {
      const blockDto: BlockTaskDto = {
        reason: 'Waiting for client approval',
      };

      const mockBlockedTask = {
        id: 'uuid-1',
        status: TaskStatus.BLOCKED,
      };

      mockTasksService.blockTask.mockResolvedValue(mockBlockedTask);

      const result = await controller.blockTask('uuid-1', blockDto);

      expect(result).toEqual(mockBlockedTask);
      expect(service.blockTask).toHaveBeenCalledWith(
        'uuid-1',
        'Waiting for client approval',
      );
    });

    it('should block a task without reason', async () => {
      const blockDto: BlockTaskDto = {};

      const mockBlockedTask = {
        id: 'uuid-1',
        status: TaskStatus.BLOCKED,
      };

      mockTasksService.blockTask.mockResolvedValue(mockBlockedTask);

      const result = await controller.blockTask('uuid-1', blockDto);

      expect(result).toEqual(mockBlockedTask);
      expect(service.blockTask).toHaveBeenCalledWith('uuid-1', undefined);
    });
  });

  describe('unblockTask', () => {
    it('should unblock a task', async () => {
      const mockUnblockedTask = {
        id: 'uuid-1',
        status: TaskStatus.ACTIVE,
      };

      mockTasksService.unblockTask.mockResolvedValue(mockUnblockedTask);

      const result = await controller.unblockTask('uuid-1');

      expect(result).toEqual(mockUnblockedTask);
      expect(service.unblockTask).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('archiveTask', () => {
    it('should archive a task', async () => {
      const mockArchivedTask = {
        id: 'uuid-1',
        status: TaskStatus.ARCHIVED,
        deletedAt: new Date(),
      };

      mockTasksService.archiveTask.mockResolvedValue(mockArchivedTask);

      const result = await controller.archiveTask('uuid-1');

      expect(result).toEqual(mockArchivedTask);
      expect(service.archiveTask).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('unarchiveTask', () => {
    it('should unarchive a task', async () => {
      const mockUnarchivedTask = {
        id: 'uuid-1',
        status: TaskStatus.ACTIVE,
        deletedAt: null,
      };

      mockTasksService.unarchiveTask.mockResolvedValue(mockUnarchivedTask);

      const result = await controller.unarchiveTask('uuid-1');

      expect(result).toEqual(mockUnarchivedTask);
      expect(service.unarchiveTask).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('moveToNextOccurrence', () => {
    it('should calculate next occurrence for recurring task', async () => {
      const mockTask = {
        id: 'uuid-1',
        recurrence: TaskRecurrence.WEEKLY,
        nextOccurrence: new Date('2025-11-02'),
      };

      mockTasksService.moveToNextOccurrence.mockResolvedValue(mockTask);

      const result = await controller.moveToNextOccurrence('uuid-1');

      expect(result).toEqual(mockTask);
      expect(service.moveToNextOccurrence).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('calculateProgressFromChildren', () => {
    it('should recalculate progress from children', async () => {
      const mockTask = {
        id: 'uuid-1',
        progress: 65,
      };

      mockTasksService.calculateProgressFromChildren.mockResolvedValue(
        mockTask,
      );

      const result = await controller.calculateProgressFromChildren('uuid-1');

      expect(result).toEqual(mockTask);
      expect(service.calculateProgressFromChildren).toHaveBeenCalledWith(
        'uuid-1',
      );
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove('uuid-1');

      expect(service.remove).toHaveBeenCalledWith('uuid-1');
    });
  });
});
