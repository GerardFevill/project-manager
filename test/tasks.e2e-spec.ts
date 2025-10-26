import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../src/tasks/entities/task.entity';
import { TaskHistory } from '../src/tasks/entities/task-history.entity';
import { TaskStatus } from '../src/tasks/enums/task-status.enum';
import { TaskRecurrence } from '../src/tasks/enums/task-recurrence.enum';
import { Repository } from 'typeorm';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let taskRepository: Repository<Task>;
  let createdTaskId: string;
  let parentTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    taskRepository = moduleFixture.get<Repository<Task>>(
      getRepositoryToken(Task),
    );
  });

  afterAll(async () => {
    // Clean up: delete all test tasks and history
    await taskRepository.query('DELETE FROM task_history');
    await taskRepository.query('DELETE FROM tasks');
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new root task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Project',
          description: 'A test project',
          priority: 'high',
          dueDate: '2025-12-31',
          status: TaskStatus.ACTIVE,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Project');
          expect(res.body.level).toBe(0);
          expect(res.body.parentId).toBeNull();
          expect(res.body.status).toBe(TaskStatus.ACTIVE);
          expect(res.body.progress).toBe(0);
          parentTaskId = res.body.id; // Save for later tests
        });
    });

    it('should create a child task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Child Task',
          parentId: parentTaskId,
          priority: 'medium',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Child Task');
          expect(res.body.level).toBe(1);
          expect(res.body.parentId).toBe(parentTaskId);
          createdTaskId = res.body.id;
        });
    });

    it('should fail validation with invalid title (too short)', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'AB', // Less than 3 characters
          priority: 'high',
        })
        .expect(400);
    });

    it('should fail validation with invalid priority', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Valid Title',
          priority: 'invalid-priority',
        })
        .expect(400);
    });

    it('should fail with non-existent parent', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Orphan Task',
          parentId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(404);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter active tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks?status=active')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((task: Task) => {
            expect(task.status).toBe(TaskStatus.ACTIVE);
          });
        });
    });

    it('should filter root tasks only', () => {
      return request(app.getHttpServer())
        .get('/tasks?onlyRoot=true')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((task: Task) => {
            expect(task.parentId).toBeNull();
            expect(task.level).toBe(0);
          });
        });
    });

    it('should filter by priority', () => {
      return request(app.getHttpServer())
        .get('/tasks?priority=high')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((task: Task) => {
            expect(task.priority).toBe('high');
          });
        });
    });

    it('should filter by parent', () => {
      return request(app.getHttpServer())
        .get(`/tasks?parentId=${parentTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((task: Task) => {
            expect(task.parentId).toBe(parentTaskId);
          });
        });
    });
  });

  describe('GET /tasks/stats', () => {
    it('should return statistics', () => {
      return request(app.getHttpServer())
        .get('/tasks/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('byStatus');
          expect(res.body).toHaveProperty('byPriority');
          expect(res.body).toHaveProperty('overdue');
          expect(res.body).toHaveProperty('completionRate');
          expect(res.body).toHaveProperty('avgProgress');
          expect(typeof res.body.total).toBe('number');
          expect(typeof res.body.completionRate).toBe('number');
          expect(typeof res.body.avgProgress).toBe('number');
          expect(res.body.byStatus).toHaveProperty('active');
          expect(res.body.byStatus).toHaveProperty('completed');
          expect(res.body.byPriority).toHaveProperty('high');
        });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a specific task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('level');
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .get('/tasks/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 400 for invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/tasks/invalid-uuid')
        .expect(400);
    });

    it('should include relations when requested', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}?includeRelations=true`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('parent');
          expect(res.body).toHaveProperty('children');
        });
    });
  });

  describe('GET /tasks/:id/children', () => {
    it('should return children of a task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${parentTaskId}/children`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          res.body.forEach((child: Task) => {
            expect(child.parentId).toBe(parentTaskId);
          });
        });
    });

    it('should return empty array for task with no children', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}/children`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('GET /tasks/:id/tree', () => {
    it('should return full task tree', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${parentTaskId}/tree`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('children');
          expect(Array.isArray(res.body.children)).toBe(true);
        });
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          title: 'Updated Child Task',
          priority: 'urgent',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Updated Child Task');
          expect(res.body.priority).toBe('urgent');
        });
    });

    it('should complete a task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          status: TaskStatus.COMPLETED,
          progress: 100,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(TaskStatus.COMPLETED);
          expect(res.body.progress).toBe(100);
          expect(res.body.completedAt).toBeDefined();
        });
    });

    it('should fail validation with invalid data', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          priority: 'invalid',
        })
        .expect(400);
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/00000000-0000-0000-0000-000000000000')
        .send({
          title: 'New Title',
        })
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id/toggle', () => {
    it('should toggle task completion status', async () => {
      // First get current status
      const getResponse = await request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200);

      const initialStatus = getResponse.body.status;

      // Toggle
      const toggleResponse = await request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/toggle`)
        .expect(200);

      // Should toggle between ACTIVE and COMPLETED
      if (initialStatus === TaskStatus.ACTIVE) {
        expect(toggleResponse.body.status).toBe(TaskStatus.COMPLETED);
      } else if (initialStatus === TaskStatus.COMPLETED) {
        expect(toggleResponse.body.status).toBe(TaskStatus.ACTIVE);
      }
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/00000000-0000-0000-0000-000000000000/toggle')
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    let taskToDelete: string;

    beforeAll(async () => {
      // Create a task to delete
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task to Delete',
          priority: 'low',
        })
        .expect(201);

      taskToDelete = response.body.id;
    });

    it('should delete a task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${taskToDelete}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent task', () => {
      return request(app.getHttpServer())
        .delete('/tasks/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should cascade delete children', async () => {
      // Create parent
      const parentResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Parent to Delete',
        })
        .expect(201);

      const parentId = parentResponse.body.id;

      // Create child
      const childResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Child to Cascade Delete',
          parentId,
        })
        .expect(201);

      const childId = childResponse.body.id;

      // Delete parent
      await request(app.getHttpServer())
        .delete(`/tasks/${parentId}`)
        .expect(204);

      // Verify child was also deleted
      await request(app.getHttpServer())
        .get(`/tasks/${childId}`)
        .expect(404);
    });
  });

  describe('Fractal hierarchy', () => {
    it('should create and navigate a 3-level hierarchy', async () => {
      // Level 0: Project
      const project = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Project', priority: 'high' })
        .expect(201);

      expect(project.body.level).toBe(0);

      // Level 1: Phase
      const phase = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Phase 1', parentId: project.body.id })
        .expect(201);

      expect(phase.body.level).toBe(1);

      // Level 2: Task
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Design', parentId: phase.body.id })
        .expect(201);

      expect(task.body.level).toBe(2);

      // Get full tree
      const tree = await request(app.getHttpServer())
        .get(`/tasks/${project.body.id}/tree`)
        .expect(200);

      expect(tree.body.children.length).toBeGreaterThan(0);
    });
  });

  describe('POST /tasks/:id/block', () => {
    it('should block a task with reason', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Block', status: TaskStatus.ACTIVE })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/block`)
        .send({ reason: 'Waiting for approval' })
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.BLOCKED);
    });

    it('should block a task without reason', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Another Task to Block' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/block`)
        .send({})
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.BLOCKED);
    });
  });

  describe('POST /tasks/:id/unblock', () => {
    it('should unblock a blocked task', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Unblock', status: TaskStatus.BLOCKED })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/unblock`)
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.ACTIVE);
    });
  });

  describe('POST /tasks/:id/archive', () => {
    it('should archive a task (soft delete)', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Archive' })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/archive`)
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.ARCHIVED);
      expect(response.body.deletedAt).toBeDefined();
    });
  });

  describe('POST /tasks/:id/unarchive', () => {
    it('should unarchive a task', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task to Unarchive', status: TaskStatus.ARCHIVED })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/unarchive`)
        .expect(200);

      expect(response.body.status).toBe(TaskStatus.ACTIVE);
      expect(response.body.deletedAt).toBeNull();
    });
  });

  describe('Recurrence', () => {
    it('should create a recurring task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Daily Standup',
          recurrence: TaskRecurrence.DAILY,
          nextOccurrence: '2025-10-27T09:00:00Z',
        })
        .expect(201);

      expect(response.body.recurrence).toBe(TaskRecurrence.DAILY);
      expect(response.body.nextOccurrence).toBeDefined();
    });

    it('should get upcoming recurrences', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/recurring/upcoming?days=7')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should calculate next occurrence for recurring task', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Weekly Review',
          recurrence: TaskRecurrence.WEEKLY,
          nextOccurrence: '2025-10-27T10:00:00Z',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/next-occurrence`)
        .expect(200);

      expect(response.body.nextOccurrence).toBeDefined();
      expect(response.body.lastOccurrence).toBeDefined();
    });

    it('should fail to calculate next occurrence for non-recurring task', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'One-time Task', recurrence: TaskRecurrence.NONE })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/next-occurrence`)
        .expect(400);
    });
  });

  describe('GET /tasks/:id/history', () => {
    it('should return task history', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task with History' })
        .expect(201);

      // Perform some actions
      await request(app.getHttpServer())
        .patch(`/tasks/${task.body.id}`)
        .send({ status: TaskStatus.ACTIVE })
        .expect(200);

      await request(app.getHttpServer())
        .post(`/tasks/${task.body.id}/block`)
        .send({ reason: 'Test block' })
        .expect(200);

      // Get history
      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.body.id}/history`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('action');
      expect(response.body[0]).toHaveProperty('executedAt');
      expect(response.body[0]).toHaveProperty('statusAtExecution');
    });
  });

  describe('GET /tasks/:id/progress', () => {
    it('should return task progress details', async () => {
      const task = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task with Progress', progress: 50 })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/tasks/${task.body.id}/progress`)
        .expect(200);

      expect(response.body).toHaveProperty('taskId');
      expect(response.body).toHaveProperty('currentProgress');
    });
  });

  describe('POST /tasks/:id/calculate-progress', () => {
    it('should recalculate progress from children', async () => {
      // Create parent
      const parent = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Parent Task' })
        .expect(201);

      // Create children with different progress
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Child 1',
          parentId: parent.body.id,
          progress: 100,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Child 2',
          parentId: parent.body.id,
          progress: 50,
        })
        .expect(201);

      // Calculate progress
      const response = await request(app.getHttpServer())
        .post(`/tasks/${parent.body.id}/calculate-progress`)
        .expect(200);

      expect(response.body.progress).toBe(75); // (100 + 50) / 2
    });
  });

  describe('GET /tasks/:id/ancestors', () => {
    it('should return all ancestors', async () => {
      // Create hierarchy
      const grandparent = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Grandparent' })
        .expect(201);

      const parent = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Parent', parentId: grandparent.body.id })
        .expect(201);

      const child = await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Child', parentId: parent.body.id })
        .expect(201);

      // Get ancestors
      const response = await request(app.getHttpServer())
        .get(`/tasks/${child.body.id}/ancestors`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2); // parent and grandparent
    });
  });

  describe('Tags and Metadata', () => {
    it('should create task with tags', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task with Tags',
          tags: ['urgent', 'backend', 'bug-fix'],
        })
        .expect(201);

      expect(response.body.tags).toEqual(['urgent', 'backend', 'bug-fix']);
    });

    it('should filter tasks by tags', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Tagged Task',
          tags: ['frontend', 'feature'],
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/tasks?tags=frontend')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create task with metadata', async () => {
      const metadata = {
        estimatedDuration: '2 hours',
        assignee: 'John Doe',
        customField: 'value',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task with Metadata',
          metadata,
        })
        .expect(201);

      expect(response.body.metadata).toEqual(metadata);
    });
  });

  describe('Progress tracking', () => {
    it('should validate progress range (0-100)', async () => {
      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Invalid Progress',
          progress: 150,
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Invalid Negative Progress',
          progress: -10,
        })
        .expect(400);
    });

    it('should accept valid progress values', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Valid Progress',
          progress: 75,
        })
        .expect(201);

      expect(response.body.progress).toBe(75);
    });
  });
});
