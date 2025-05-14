import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';

import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * @class AppController
 * @description Handles the main page request and sends a welcome message.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void} Sends a JSON response with a welcome message.
 */
@JsonController()
@Service()
export class AppController {
  /**
   * Handles the main page request and sends a welcome message.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {void} Sends a JSON response with a welcome message.
   */
  @Get('/')
  public index(): ApiResponseDto<void> {
    return { success: true, message: 'Welcome to the Atom Tasks API!' };
  }
}