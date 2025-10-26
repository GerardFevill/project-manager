import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../src/tasks/task.entity';
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
    // Clean up: delete all test tasks
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
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Project');
          expect(res.body.level).toBe(0);
          expect(res.body.parentId).toBeNull();
          expect(res.body.completed).toBe(false);
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
            expect(task.completed).toBe(false);
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
          expect(res.body).toHaveProperty('active');
          expect(res.body).toHaveProperty('completed');
          expect(res.body).toHaveProperty('overdue');
          expect(res.body).toHaveProperty('completionRate');
          expect(typeof res.body.total).toBe('number');
          expect(typeof res.body.completionRate).toBe('number');
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
          completed: true,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
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

      const initialStatus = getResponse.body.completed;

      // Toggle
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/toggle`)
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(!initialStatus);
        });
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
});
