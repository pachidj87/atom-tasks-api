import jwt from 'jsonwebtoken';
import { Container } from 'typedi';

import { Action } from 'routing-controllers';

export default {
  authorizationChecker: async (action: Action) => {
    try {
      // here you can use request/response objects from action
      // also if decorator defines roles it needs to access the action
      // you can use them to provide granular access check
      // checker must return either boolean (true or false)
      // either promise that resolves a boolean value
      // demo code:
      const token = action.request.headers['authorization']?.split(' ')[1];

      if (!token) return false;

      const authService: any = Container.get('AuthService');
      const decodedToken = await authService.validateToken(token);

      const user = await authService.getUserByEmail(decodedToken.email);

      action.request.user = user;

      return true;
    } catch (error) {
      // handle error
      console.error('Error in authorization checker:', error);
      return false;
    }
  },
  currentUserChecker: async (action: Action) => action.request.user,
}