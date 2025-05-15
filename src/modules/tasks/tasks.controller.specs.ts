import 'reflect-metadata';
import request from 'supertest';
import { Action, createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';

import { initializeApp, cert } from 'firebase-admin/app';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { RepositoryService } from '../../services/repository.service';
import * as serviceAccount from '../../service-account-key.json';

jest.mock('./tasks.service');

describe('TasksController', () => {
  let app: any;
  let tasksService: jest.Mocked<TasksService>;
  let repositoryServiceMock: jest.Mocked<RepositoryService>;
  let authConfig: any = {
    authorizationChecker: async (action: Action) => true,
    currentUserChecker: async (action: Action) => null,
  };

  beforeAll(() => {
    const config: any = serviceAccount;
    initializeApp({
      credential: cert(config),
    });
    useContainer(Container);
    app = createExpressServer({
      controllers: [TasksController],
      classTransformer: true,
      // If you want to see authorization errors, you can uncomment the next line
      ...authConfig,
    });

    repositoryServiceMock = new RepositoryService() as jest.Mocked<RepositoryService>;
    tasksService = new TasksService(repositoryServiceMock) as jest.Mocked<TasksService>;
    Container.set(TasksService, tasksService);
  });

  describe('GET /tasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task', description: 'Test Description', ownerId: '123', isCompleted: true }];
      tasksService.getAllTasks.mockResolvedValue(mockTasks);

      const response = await request(app).get('/tasks').expect(200);

      expect(response.body).toEqual({ success: true, data: mockTasks });
      expect(tasksService.getAllTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should fetch a task by ID', async () => {
      const mockTask = { id: '1', title: 'Test Task', description: 'Test Description', ownerId: '123', isCompleted: true };
      tasksService.getTaskById.mockResolvedValue(mockTask);

      const response = await request(app).get('/tasks/1').expect(200);

      expect(response.body).toEqual({ success: true, data: mockTask });
      expect(tasksService.getTaskById).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /tasks/owner/:id', () => {
    it('should fetch tasks by owner ID', async () => {
      const mockTasks = [{ id: '1', title: 'Test Task', description: 'Test Description', ownerId: '123', isCompleted: true }];
      tasksService.getTasksByOwnerId.mockResolvedValue(mockTasks);

      const response = await request(app).get('/tasks/owner/123').expect(200);

      expect(response.body).toEqual({ success: true, data: mockTasks });
      expect(tasksService.getTasksByOwnerId).toHaveBeenCalledWith('123');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const mockTask = { id: '1', title: 'New Task', description: 'New Description', ownerId: '123', isCompleted: false };
      tasksService.createTask.mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New Task', description: 'New Description', ownerId: '123', isCompleted: false })
        .expect(200);

      expect(response.body).toEqual({ success: true, data: mockTask });
      expect(tasksService.createTask).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
        ownerId: '123',
        isCompleted: false,
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task', async () => {
      const mockTask = { id: '1', title: 'Updated Task', description: 'Updated Description', ownerId: '123', isCompleted: false };
      tasksService.updateTask.mockResolvedValue(mockTask);

      const response = await request(app)
        .put('/tasks/1')
        .send({ title: 'Updated Task', description: 'Updated Description', ownerId: '123', isCompleted: false })
        .expect(200);

      expect(response.body).toEqual({ success: true, data: mockTask });
      expect(tasksService.updateTask).toHaveBeenCalledWith('1', {
        title: 'Updated Task',
        description: 'Updated Description',
        ownerId: '123',
        isCompleted: false,
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task by ID', async () => {
      const mockResponse = { id: '1', deleted: true };
      tasksService.deleteTask.mockResolvedValue(mockResponse);

      const response = await request(app).delete('/tasks/1').expect(200);

      expect(response.body).toEqual({ success: true, message: 'Task deleted successfully', data: mockResponse });
      expect(tasksService.deleteTask).toHaveBeenCalledWith('1');
    });
  });
});