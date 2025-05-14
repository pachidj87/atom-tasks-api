import { Service } from 'typedi';
import { JsonController, Get, Post, Body, Params, NotFoundError, NotAcceptableError } from 'routing-controllers';

import { RepositoryService } from '../../services/repository.service';
import { Task } from './entities/task.entity';

@Service()
export class TasksService {
  /**
   * @description TasksService class for handling task-related operations.
   * @class TasksService
   */
  constructor(
    private readonly repositoryService: RepositoryService,
  ) {}

  /**
   * @description Fetches all tasks.
   * @returns {Promise<Task[]>} - A promise that resolves to an array of Task objects.
   */
  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.repositoryService.getCollection('tasks')
      .then((data: any) => {
        return data.map((task: any) => this.parseDate(task));
      });
    return tasks;
  }

  /**
   * @description Fetches a task by its ID.
   * @param {string} id - The ID of the task to fetch.
   * @returns {Promise<Task>} - A promise that resolves to the Task object.
   */
  async getTaskById(id: string): Promise<Task> {
    const task = await this.repositoryService.getDocument('tasks', id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return this.parseDate(task);
  }

  /**
   * @description Fetches tasks by a specific user ID.
   * @param {string} userId - The ID of the user whose tasks to fetch.
   * @returns {Promise<Task[]>} - A promise that resolves to an array of Task objects.
   */
  async getTasksByOwnerId(userId: string): Promise<Task[]> {
    const tasks = await this.repositoryService.queryCollection('tasks', [['ownerId', '==', userId]]);
    if (!tasks) {
      throw new NotFoundError('Tasks not found');
    }
    return tasks.map((task: any) => this.parseDate(task));
  }

  /**
   * @description Creates a new task.
   * @param {Task} task - The Task object to create.
   * @returns {Promise<Task>} - A promise that resolves to the created Task object.
   */
  async createTask(task: Task): Promise<Task> {
    const date = new Date();
    task.createdAt = date;
    task.updatedAt = date;
    const createdTask = await this.repositoryService.addDocument('tasks', task);
    return createdTask;
  }

  /**
   * @description Updates an existing task by its ID.
   * @param {string} id - The ID of the task to update.
   * @param {Task} task - The updated Task object.
   * @returns {Promise<Task>} - A promise that resolves to the updated Task object.
   */
  async updateTask(id: string, task: Task): Promise<Task> {

    const updatedTask = await this.repositoryService.updateDocument('tasks', id, { ...task, updatedAt: new Date() });
    if (!updatedTask) {
      throw new NotFoundError('Task not found');
    }
    return this.parseDate(updatedTask);
  }

  /**
   * @description Deletes a task by its ID.
   * @param {string} id - The ID of the task to delete.
   * @returns {Promise<void>} - A promise that resolves when the task is deleted.
   */
  async deleteTask(id: string): Promise<{ id: string; deleted: boolean }> {
    const deletedTask = await this.repositoryService.deleteDocument('tasks', id);
    if (!deletedTask) {
      throw new NotFoundError('Task not found');
    }

    return deletedTask;
  }

  private parseDate(data: any) {
    let createdAt = data.createdAt;
    createdAt = (createdAt && typeof createdAt !== 'string') ? createdAt.toDate() : createdAt;

    let updatedAt = data.updatedAt;
    updatedAt = (updatedAt && typeof updatedAt !== 'string') ? updatedAt.toDate() : updatedAt;

    return { ...data, createdAt, updatedAt }; 
  }
}