/**
 * TasksController is responsible for handling HTTP requests related to tasks.
 * It provides methods to fetch, create, update, and delete tasks by interacting
 * with the TaskService.
 */
import { 
  Authorized, 
  Body, 
  Delete, 
  Get, 
  JsonController, 
  Post, 
  Params, 
  Put 
} from 'routing-controllers';
import { Service } from 'typedi';

import { TasksService } from './tasks.service';
import { EntityIdParamDto } from '../../dto/entity-id-param.dto';
import { ApiResponseDto } from '../../dto/api-response.dto';
import { TaskDto } from './dto/task.dto';
import { EntityDeletedResponseDto } from '../../dto/entity-deleted-response.dto';

/**
 * @class TasksController
 * @classdesc Controller for handling task-related operations.
 *
 * This class provides methods to:
 * - Retrieve all tasks
 * - Retrieve a task by ID
 * - Retrieve tasks by user ID
 * - Create a new task
 * - Update an existing task by ID
 * - Delete a task by ID
 *
 * Each method interacts with the TaskService to perform the necessary operations
 * and sends appropriate HTTP responses.
 */
@JsonController('/tasks')
@Service()
export class TasksController {
  /**
   * Creates an instance of TasksController.
   * @constructor
   * @param {TaskService} taskService - The TaskService instance for handling task-related logic.
   */
  constructor(private readonly taskService: TasksService) {}

  /**
   * Fetches all tasks.
   * @async
   * @returns {Promise<void>} Sends a JSON response with the tasks or an error message.
   */
  @Get('/')
  @Authorized()
  async getAllTasks(): Promise<ApiResponseDto<TaskDto[]>> {
    const tasks = await this.taskService.getAllTasks();
    return { success: true, data: tasks };
  }

  /**
   * Fetches a task by its ID.
   * @async
   * @param {Object} req - Express request object.
   * @param {string} req.params.id - ID of the task to fetch.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the task or an error message.
   */
  @Get('/:id')
  @Authorized()
  async getTaskById(@Params() param: EntityIdParamDto): Promise<ApiResponseDto<TaskDto>> {
    const task = await this.taskService.getTaskById(param.id);
    return { success: true, data: task };
  }

  /**
   * Fetches tasks by a specific user ID.
   * @async
   * @param {Object} req - Express request object.
   * @param {string} req.params.userId - ID of the user whose tasks to fetch.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the tasks or an error message.
   */
  @Get('/owner/:id')
  @Authorized()
  async getTasksByOwnerId(@Params() param: EntityIdParamDto): Promise<ApiResponseDto<TaskDto[]>> {
    const tasks = await this.taskService.getTasksByOwnerId(param.id);
    return { success: true, data: tasks };
  }

  /**
   * Creates a new task.
   * @async
   * @param {Object} req - Express request object.
   * @param {Object} req.body - Data for the new task.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the created task or an error message.
   */
  @Post('/')
  @Authorized()
  async createTask(@Body() data: TaskDto): Promise<ApiResponseDto<TaskDto>> {
    const newTask = await this.taskService.createTask(data);
    return { success: true, data: newTask };
  }

  /**
   * Updates an existing task.
   * @async
   * @param {Object} req - Express request object.
   * @param {string} req.params.id - ID of the task to update.
   * @param {Object} req.body - Updated data for the task.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response with the updated task or an error message.
   */
  @Put('/:id')
  @Authorized()
  async updateTask(@Params() param: EntityIdParamDto, @Body() data: TaskDto): Promise<ApiResponseDto<TaskDto>> {
    const updatedTask = await this.taskService.updateTask(param.id, data);
    return { success: true, data: updatedTask };
  }

  /**
   * Deletes a task by its ID.
   * @async
   * @param {Object} req - Express request object.
   * @param {string} req.params.id - ID of the task to delete.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Sends a JSON response confirming deletion or an error message.
   */
  @Delete('/:id')
  @Authorized()
  async deleteTask(@Params() param: EntityIdParamDto): Promise<ApiResponseDto<EntityDeletedResponseDto>> {
    const deletedTask = await this.taskService.deleteTask(param.id);
    return { success: true, message: 'Task deleted successfully', data: deletedTask };
  }
}