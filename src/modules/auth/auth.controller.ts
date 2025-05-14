/**
 * AuthController handles authentication-related operations.
 * It provides methods for user login, registration, and token verification.
 */
import { Request, Response } from 'express';
import { Body, JsonController, Post, Req, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { AuthService } from './auth.service';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ApiResponseDto } from '../../dto/api-response.dto';
import { AuthDto } from './dto/auth.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { IsValidDto } from './dto/is-valid.dto';

/**
 * @class AuthController
 * @classdesc Handles authentication-related operations such as user login, registration, 
 * email verification, and token verification. This controller interacts with the AuthService 
 * to perform these operations and sends appropriate responses to the client.
 */
@JsonController('/auth')
@Service()
export class AuthController {  
  /**
   * Creates an instance of AuthController.
   * 
   * @constructor
   * @param {AuthService} authService - The AuthService instance for handling authentication logic.
   */
  constructor(
    @Inject('AuthService')
    private readonly authService: AuthService
  ) {}

  /**
   * Handles user login by validating credentials and returning a token.
   * 
   * @async
   * @function login
   * @memberof AuthController
   * @param {Request} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Response} res - The response object.
   * @returns {ApiResponseDto} Sends a JSON response with a success status and token if login is successful, 
   * or an error message if login fails.
   */
  @Post('/login')
  async login(@Body() data: AuthDto): Promise<ApiResponseDto<{ token: string }>> {
    const { email, password } = data;
    const token = await this.authService.login(email, password);
    return { success: true, data: { token } };
  }

  /**
   * Handles user registration by creating a new user and returning the user data.
   * 
   * @async
   * @function register
   * @memberof AuthController
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.email - The email of the user.
   * @param {string} req.body.password - The password of the user.
   * @param {Object} res - The response object.
   * @returns {void} Sends a JSON response with a success status and user data if registration is successful, 
   * or an error message if registration fails.
   */
  @Post('/register')
  async register(@Body() data: AuthDto): Promise<ApiResponseDto<AuthDto>> {
    const { email, password } = data;
    const user = await this.authService.register(email, password);
    return { success: true, data: user };
  }

  /**
   * Handles email verification by validating the provided email token.
   * 
   * @async
   * @function validateEmail
   * @memberof AuthController
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.token - The email verification token.
   * @param {Object} res - The response object.
   * @returns {void} Sends a JSON response with a success status if email verification is successful, 
   * or an error message if verification fails.
   */
  @Post('/validate-email')
  async validateEmail(@Body() data: ValidateEmailDto): Promise<ApiResponseDto<IsValidDto>> {
    const result = await this.authService.validateEmail(data.email);
    return { success: true, message: 'Email verified successfully', data: { isValid: result } };
  }

  /**
   * Verifies a token and returns the verification result.
   * 
   * @async
   * @function validateToken
   * @memberof AuthController
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.token - The token to verify.
   * @param {Object} res - The response object.
   * @returns {void} Sends a JSON response with a success status and verification result if verification is successful, 
   * or an error message if verification fails.
   */
  @Post('/validate-token')
  async validateToken(@Body() data: ValidateTokenDto): Promise<ApiResponseDto<IsValidDto>> {
    const isValid = await this.authService.validateToken(data.token);
    return { success: true, data: { isValid } };
  }
}

