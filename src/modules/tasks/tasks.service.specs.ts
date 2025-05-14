import 'reflect-metadata';
import { TasksService } from './tasks.service';
import { Timestamp } from 'firebase-admin/firestore'

import { RepositoryService } from '../../services/repository.service';
import { Task } from './entities/task.entity';
import { NotFoundError } from 'routing-controllers';

jest.mock('../../services/repository.service');

describe('TasksService', () => {
  let tasksService: TasksService;
  let repositoryService: jest.Mocked<RepositoryService>;

  beforeEach(() => {
    repositoryService = new RepositoryService() as jest.Mocked<RepositoryService>;
    tasksService = new TasksService(repositoryService);
  });

  describe('getAllTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks: Task[] = [{ id: '1', title: 'Test Task', description: 'Test Task Description', ownerId: 'user1', isCompleted: false }];
      repositoryService.getCollection.mockResolvedValue(mockTasks);

      const tasks = await tasksService.getAllTasks();

      expect(repositoryService.getCollection).toHaveBeenCalledWith('tasks');
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a task by its ID', async () => {
      const mockTask: Task = { id: '1', title: 'Test Task', description: 'Test Task Description', ownerId: 'user1', isCompleted: true };
      repositoryService.getDocument.mockResolvedValue(mockTask);

      const task = await tasksService.getTaskById('1');

      expect(repositoryService.getDocument).toHaveBeenCalledWith('tasks', '1');
      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundError if task is not found', async () => {
      repositoryService.getDocument.mockResolvedValue(null);

      await expect(tasksService.getTaskById('1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getTasksByOwnerId', () => {
    it('should fetch tasks by owner ID', async () => {
      const mockTasks: Task[] = [{ id: '1', title: 'Test Task', description: 'Test Task Description', ownerId: 'user1', isCompleted: false }];
      repositoryService.queryCollection.mockResolvedValue(mockTasks);

      const tasks = await tasksService.getTasksByOwnerId('user1');

      expect(repositoryService.queryCollection).toHaveBeenCalledWith('tasks', [['ownerId', '==', 'user1']]);
      expect(tasks).toEqual(mockTasks);
    });

    it('should throw NotFoundError if no tasks are found', async () => {
      repositoryService.queryCollection.mockResolvedValue(null);

      await expect(tasksService.getTasksByOwnerId('user1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const mockTask: Task = { id: '1', title: 'New Task', description: 'New Task Description', ownerId: 'user1', isCompleted: false };
      repositoryService.addDocument.mockResolvedValue(mockTask);

      const task = await tasksService.createTask(mockTask);

      expect(repositoryService.addDocument).toHaveBeenCalledWith('tasks', expect.objectContaining({
        title: 'New Task',
        ownerId: 'user1',
        description: 'New Task Description',
        isCompleted: false
      }));
      expect(task).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const mockTask: Task = { id: '1', title: 'Updated Task', description: 'Updated Task Description', ownerId: 'user1', isCompleted: true };
      repositoryService.updateDocument.mockResolvedValue(mockTask);

      const task = await tasksService.updateTask('1', mockTask);

      expect(repositoryService.updateDocument).toHaveBeenCalledWith('tasks', '1', expect.objectContaining({
        title: 'Updated Task',
        description: 'Updated Task Description',
        ownerId: 'user1',
        isCompleted: true
      }));
      expect(task).toEqual(mockTask);
    });

    it('should throw NotFoundError if task is not found', async () => {
      repositoryService.updateDocument.mockResolvedValue(null);

      await expect(tasksService.updateTask('1', {} as Task)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task by its ID', async () => {
      const mockResponse = { id: '1', deleted: true };
      repositoryService.deleteDocument.mockResolvedValue(mockResponse);

      const result = await tasksService.deleteTask('1');

      expect(repositoryService.deleteDocument).toHaveBeenCalledWith('tasks', '1');
      expect(result).toEqual(mockResponse);
    });

    it('should throw NotFoundError if task is not found', async () => {
      repositoryService.deleteDocument.mockResolvedValue(null);

      await expect(tasksService.deleteTask('1')).rejects.toThrow(NotFoundError);
    });
  });
});