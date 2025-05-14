import 'reflect-metadata';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { NotFoundError, NotAcceptableError } from 'routing-controllers';
import { AuthService } from './auth.service';
import { RepositoryService } from '../../services/repository.service';
import { User } from '../../entities/user.entity';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let repositoryServiceMock: jest.Mocked<RepositoryService>;

  beforeEach(() => {
    repositoryServiceMock = {
      getDb: jest.fn(),
    } as unknown as jest.Mocked<RepositoryService>;

    authService = new AuthService(repositoryServiceMock);
    Container.set('AuthService', authService);
  });

  describe('login', () => {
    it('should return a JWT token if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user: User = { id: '1', email, password: 'hashedPassword' };

      jest.spyOn(authService as any, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(authService as any, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(authService as any, 'generateToken').mockReturnValue('mockToken');

      const token = await authService.login(email, password);

      expect(token).toBe('mockToken');
    });

    it('should throw NotAcceptableError if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const user: User = { id: '1', email, password: 'hashedPassword' };

      jest.spyOn(authService as any, 'getUserByEmail').mockResolvedValue(user);
      jest.spyOn(authService as any, 'comparePassword').mockResolvedValue(false);

      await expect(authService.login(email, password)).rejects.toThrow(NotAcceptableError);
    });
  });

  describe('register', () => {
    it('should create a new user and return it', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';
      const hashedPassword = 'hashedPassword';
      const user: User = { email, password: hashedPassword };

      jest.spyOn(authService as any, 'hashPassword').mockResolvedValue(hashedPassword);
      repositoryServiceMock.getDb.mockReturnValue({
        collection: jest.fn().mockReturnValue({
          add: jest.fn().mockResolvedValue({ id: '1' }),
        }),
      } as any);

      const result = await authService.register(email, password);

      expect(result).toEqual({ id: '1', ...user });
    });

    it('should throw an error if user creation fails', async () => {
      const email = 'newuser@example.com';
      const password = 'password123';

      jest.spyOn(authService as any, 'hashPassword').mockResolvedValue('hashedPassword');
      repositoryServiceMock.getDb.mockReturnValue({
        collection: jest.fn().mockReturnValue({
          add: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      } as any);

      await expect(authService.register(email, password)).rejects.toThrow('Error creating user: Database error');
    });
  });

  describe('validateEmail', () => {
    it('should return true if email exists', async () => {
      const email = 'test@example.com';
      const user: User = { id: '1', email, password: 'hashedPassword' };

      jest.spyOn(authService as any, 'getUserByEmail').mockResolvedValue(user);

      const result = await authService.validateEmail(email);

      expect(result).toBe(true);
    });
    
    it('should throw NotFoundError if email does not exist', async () => {
      const email = 'nonexistent@example.com';

      jest.spyOn(authService as any, 'getUserByEmail').mockRejectedValue(new NotFoundError('User not found'));

      await expect(authService.validateEmail(email)).rejects.toThrow(NotFoundError);
    });

  });

  describe('validateToken', () => {
    it('should return decoded token if valid', () => {
      const token = 'validToken';
      const decodedPayload = { id: '1', email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);

      const result = authService.validateToken(token);

      expect(result).toEqual(decodedPayload);
    });

    it('should throw NotAcceptableError if token is invalid', () => {
      const token = 'invalidToken';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.validateToken(token)).toThrow(NotAcceptableError);
    });
  });

  describe('private methods', () => {
    it('getUserByEmail should return user if found', async () => {
      const email = 'test@example.com';
      const user: User = { id: '1', email, password: 'hashedPassword' };

      repositoryServiceMock.getDb.mockReturnValue({
        collection: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              empty: false,
              docs: [{ id: '1', data: () => user }],
            }),
          }),
        }),
      } as any);

      const result = await (authService as any).getUserByEmail(email);

      expect(result).toEqual({ id: '1', ...user });
    });

    it('getUserByEmail should throw NotFoundError if user not found', async () => {
      const email = 'nonexistent@example.com';

      repositoryServiceMock.getDb.mockReturnValue({
        collection: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({ empty: true }),
          }),
        }),
      } as any);

      await expect((authService as any).getUserByEmail(email)).rejects.toThrow(NotFoundError);
    });
  });
});