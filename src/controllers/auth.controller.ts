import { Response, Request, NextFunction } from 'express';

import { Methods } from '../models/interfaces';
import { UserService } from '../services/user.service';
import Controller from '../models/controller';
import { HttpError } from '../models/errors';

class AuthController extends Controller {
  path = '/users';

  userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  handleLogin = async (req: Request, res: Response, next: NewableFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.userService.login(email, password);

      res.status(200).json({ status: 'success', data: { user }, token });
    } catch (error) {
      console.error('Error 💥 ', error);
      return next(new HttpError(404, error.message));
    }
  };

  handleSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.userService.signup(req.body);

      // Send success response
      res.status(201).json({ status: 'success', data: { user }, token });
    } catch (error) {
      console.error('Error 💥 ', error);
      if (error.errno == 1062) {
        const errorMessage = error.sqlMessage.split('for')[0];
        return next(new HttpError(422, errorMessage));
      }
    }
  };

  routes = [
    {
      path: '/login', // Will become /auth/login
      method: Methods.POST,
      handler: this.handleLogin,
    },
    {
      path: '/signup', // Will become /auth/login
      method: Methods.POST,
      handler: this.handleSignup,
    },
  ];
}

export default AuthController;
