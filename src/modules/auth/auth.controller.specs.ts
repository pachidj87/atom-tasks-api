import 'reflect-metadata';
import request from 'supertest';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { initializeApp, cert } from 'firebase-admin/app';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RepositoryService } from '../../services/repository.service';
import * as serviceAccount from '../../service-account-key.json';
import authConfig from '../../configs/auth.config';

jest.mock('./auth.service');

describe('AuthController', () => {
  let app: any;
  let authServiceMock: jest.Mocked<AuthService>;
  let repositoryServiceMock: jest.Mocked<RepositoryService>;

  beforeAll(() => {    
    const config: any = serviceAccount;
    initializeApp({
      credential: cert(config),
    });
    useContainer(Container);
    app = createExpressServer({
      controllers: [AuthController],
      classTransformer: true,
      ...authConfig,
    });

    repositoryServiceMock = new RepositoryService() as jest.Mocked<RepositoryService>;
    authServiceMock = new AuthService(repositoryServiceMock) as jest.Mocked<AuthService>;
    Container.set('AuthService', authServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should return user data on successful registration', async () => {
      const registerData = { email: 'test@example.com', password: 'password123' };
      authServiceMock.register.mockResolvedValue(registerData);

      const response = await request(app).post('/auth/register').send(registerData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: registerData });
      expect(authServiceMock.register).toHaveBeenCalledWith(registerData.email, registerData.password);
    });
  });

  describe('POST /auth/login', () => {
    it('should return a token on successful login', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      authServiceMock.login.mockResolvedValue('mocked-token');

      const response = await request(app).post('/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: { token: 'mocked-token' } });
      expect(authServiceMock.login).toHaveBeenCalledWith(loginData.email, loginData.password);
    });
  });

  describe('POST /auth/validate-email', () => {
    it('should return success message on successful email validation', async () => {
      const validateEmailData = { email: 'test@example.com' };
      authServiceMock.validateEmail.mockResolvedValue(true);

      const response = await request(app).post('/auth/validate-email').send(validateEmailData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Email verified successfully',
        data: { isValid: true },
      });
      expect(authServiceMock.validateEmail).toHaveBeenCalledWith(validateEmailData.email);
    });
  });

  describe('POST /auth/validate-token', () => {
    it('should return token validation result', async () => {
      const validateTokenData = { token: 'mocked-token' };
      authServiceMock.validateToken.mockResolvedValue(true);

      const response = await request(app).post('/auth/validate-token').send(validateTokenData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true, data: { isValid: true } });
      expect(authServiceMock.validateToken).toHaveBeenCalledWith(validateTokenData.token);
    });
  });
});