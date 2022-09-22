import { Response, Request, NextFunction } from 'express';

// HTTP methods
export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

// Route interface for each route in `routes` field of `Controller` class.
export interface IRoute {
  path: string;
  method: Methods;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddleware?: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}

export interface ServerConfig {
  port?: number;
  environment?: string;
}

export interface IUser {
  id: string;
  name: string;
  password: string;
  email: string;
}

export interface IProduct {
  id: string;
  title: string;
  image?: string;
  price: number;
}
