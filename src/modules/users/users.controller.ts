
/**
 * UsersController handles user-related operations.
 * It provides methods to fetch, create, update, and delete users.
 */
import { Request, Response } from 'express';
import { Authorized, JsonController, Get, Params } from 'routing-controllers';
import { Service } from 'typedi';

import { UsersService } from './users.service';
import { ApiResponseDto } from '../../dto/api-response.dto';
import { EntityIdParamDto } from '../../dto/entity-id-param.dto';
import { UserDto } from './dto/user.dto';

/**
 * @class UsersController
 * @classdesc Controller for handling user-related operations.
 * 
 * This class provides methods to:
 * - Retrieve all users
 * - Retrieve a user by ID
 * - Create a new user
 * - Update an existing user by ID
 * - Delete a user by ID
 * 
 * Each method interacts with the UserService to perform the necessary operations
 * and sends appropriate HTTP responses.
 */
/**
 * UsersController class handles user-related operations.
 */
@JsonController('/users')
@Service()
export class UsersController {
  /**
   * Creates an instance of UsersController.
   * @constructor
   * @param {UserService} userService - The UserService instance for handling user-related logic.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Fetches a user by their ID.
   * @async
   * @param {Object} req - Express request object.
   * @param {string} req.params.id - ID of the user to fetch.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>} Responds with the user data or an error message.
   */
  @Get('/:id')
  @Authorized()
  async getUserById(@Params() param: EntityIdParamDto): Promise<ApiResponseDto<UserDto>> {
    const user = await this.usersService.getUserById(param.id);
    return { success: true, data: user };
  }
}