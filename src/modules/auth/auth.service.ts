import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Container, Service } from 'typedi';
import { NotFoundError, NotAcceptableError } from 'routing-controllers';

import { RepositoryService } from '../../services/repository.service';
import { User } from '../../entities/user.entity';

@Service('AuthService')
export class AuthService {
  /**
   * @description AuthService class for handling authentication-related tasks.
   * @class AuthService
   */  
  constructor(
    private readonly repositoryService: RepositoryService,
  ) {
    Container.set('AuthService', this);
  }

  /**
   * @description Logs in a user with the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<string>} - A promise that resolves to a JWT token.
   */
  async login(email: string, password: string): Promise<string> {
    const user = await this.getUserByEmail(email);
    const isMatch = await this.comparePassword(password, user.password)
    
    if (!isMatch) {
      throw new NotAcceptableError('Invalid password');
    }

    const tokenPayload = { id: user.id, email: user.email };
    return this.generateToken(tokenPayload);
  }

  /**
   * @description Registers a new user with the provided email and password.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<any>} - A promise that resolves to the created user object.
   */
  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      email,
      password: hashedPassword
    };
    return this.repositoryService.getDb()
      .collection('users')
      .add(user)
      .then(docRef => {
        return { id: docRef.id, ...user };
      })
      .catch(error => {
        throw new Error('Error creating user: ' + error.message);
      });
  }

  /**
   * @description Validates the provided email.
   * @param {string} email - The email to validate.
   * @returns {Promise<boolean>} - A promise that resolves to true if the email is valid, false otherwise.
   */
  async validateEmail(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  /**
   * @description Verifies the provided JWT token.
   * @param {string} token - The JWT token to verify.
   * @returns {any} - The decoded token payload if valid, otherwise throws an error.
   */
  validateToken(token): any {
    const secretKey = process.env.JWT_SECRET || 'secret';
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      throw new NotAcceptableError('Invalid or expired token');
    }
  }

  /**
   * @description Retrieves a user by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<any>} - A promise that resolves to the user object.
   */
  private async getUserByEmail(email: string): Promise<User> {
    return this.repositoryService.getDb()
      .collection('users')
      .where('email', '==', email)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          throw new NotFoundError('User not found');
        }
        const user = snapshot.docs[0].data();
        return { id: snapshot.docs[0].id, ...user };
      });
  }

  /**
   * @description Hashes the provided password.
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   */
  private async hashPassword(password): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * @description Compares the provided password with the hashed password.
   * @param {string} password - The password to compare.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
   */
  private async comparePassword(password, hashedPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * @description Generates a JWT token with the provided payload.
   * @param {Object} payload - The payload to include in the token.
   * @returns {string} - The generated JWT token.
   */
  private generateToken(payload): string {
    const secretKey = process.env.JWT_SECRET || 'secret';
    const expiresIn = process.env.JWT_TOKEN_EXPIRY || '1h';
    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
