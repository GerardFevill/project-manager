import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { Task } from './task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

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

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findChildren: jest.fn(),
    findTree: jest.fn(),
    getStats: jest.fn(),
    update: jest.fn(),
    toggle: jest.fn(),
    remove: jest.fn(),
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

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        priority: 'high',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(service.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual(mockTask);
    });

    it('should create a child task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Child Task',
        parentId: '123e4567-e89b-12d3-a456-426614174001',
      };

      const childTask = {
        ...mockTask,
        ...createTaskDto,
        level: 1,
      };

      mockTasksService.create.mockResolvedValue(childTask);

      const result = await controller.create(createTaskDto);

      expect(service.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual(childTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const tasks = [mockTask];
      const filters: TaskFilterDto = { status: 'all' };

      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(tasks);
    });

    it('should filter active tasks', async () => {
      const filters: TaskFilterDto = { status: 'active' };
      const activeTasks = [mockTask];

      mockTasksService.findAll.mockResolvedValue(activeTasks);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(activeTasks);
    });

    it('should filter by priority', async () => {
      const filters: TaskFilterDto = { priority: 'urgent' };
      const urgentTasks = [mockTask];

      mockTasksService.findAll.mockResolvedValue(urgentTasks);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(urgentTasks);
    });

    it('should filter root tasks only', async () => {
      const filters: TaskFilterDto = { onlyRoot: true };
      const rootTasks = [mockTask];

      mockTasksService.findAll.mockResolvedValue(rootTasks);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(rootTasks);
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      const stats = {
        total: 100,
        active: 60,
        completed: 40,
        overdue: 10,
        completionRate: 40,
      };

      mockTasksService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(service.getStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockTask.id);

      expect(service.findOne).toHaveBeenCalledWith(mockTask.id, false);
      expect(result).toEqual(mockTask);
    });

    it('should include relations when requested', async () => {
      const taskWithRelations = {
        ...mockTask,
        parent: null,
        children: [],
      };

      mockTasksService.findOne.mockResolvedValue(taskWithRelations);

      const result = await controller.findOne(mockTask.id, 'true');

      expect(service.findOne).toHaveBeenCalledWith(mockTask.id, true);
      expect(result).toEqual(taskWithRelations);
    });
  });

  describe('findChildren', () => {
    it('should return children of a task', async () => {
      const children = [
        { ...mockTask, id: 'child-1', parentId: mockTask.id, level: 1 },
        { ...mockTask, id: 'child-2', parentId: mockTask.id, level: 1 },
      ];

      mockTasksService.findChildren.mockResolvedValue(children);

      const result = await controller.findChildren(mockTask.id);

      expect(service.findChildren).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual(children);
      expect(result).toHaveLength(2);
    });
  });

  describe('findTree', () => {
    it('should return full task tree', async () => {
      const tree = {
        ...mockTask,
        children: [
          {
            ...mockTask,
            id: 'child-1',
            parentId: mockTask.id,
            level: 1,
            children: [
              {
                ...mockTask,
                id: 'grandchild-1',
                parentId: 'child-1',
                level: 2,
                children: [],
              },
            ],
          },
        ],
      };

      mockTasksService.findTree.mockResolvedValue(tree);

      const result = await controller.findTree(mockTask.id);

      expect(service.findTree).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual(tree);
      expect(result.children).toHaveLength(1);
      expect(result.children[0].children).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
        priority: 'urgent',
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(mockTask.id, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(result.title).toBe(updateTaskDto.title);
      expect(result.priority).toBe(updateTaskDto.priority);
    });

    it('should move task to different parent', async () => {
      const newParentId = '123e4567-e89b-12d3-a456-426614174002';
      const updateTaskDto: UpdateTaskDto = {
        parentId: newParentId,
      };

      const movedTask = {
        ...mockTask,
        parentId: newParentId,
        level: 1,
      };

      mockTasksService.update.mockResolvedValue(movedTask);

      const result = await controller.update(mockTask.id, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(result.parentId).toBe(newParentId);
      expect(result.level).toBe(1);
    });
  });

  describe('toggle', () => {
    it('should toggle task completion', async () => {
      const toggledTask = { ...mockTask, completed: true, completedAt: new Date() };

      mockTasksService.toggle.mockResolvedValue(toggledTask);

      const result = await controller.toggle(mockTask.id);

      expect(service.toggle).toHaveBeenCalledWith(mockTask.id);
      expect(result.completed).toBe(true);
      expect(result.completedAt).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(mockTask.id);

      expect(service.remove).toHaveBeenCalledWith(mockTask.id);
      expect(result).toBeUndefined();
    });
  });
});
