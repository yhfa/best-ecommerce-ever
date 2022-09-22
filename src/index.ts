import path from 'path';
import express, { json, RequestHandler, urlencoded } from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import morgan from 'morgan';
import { AppDataSource } from './data-source';
import RestServer from './server';
import AuthController from './controllers/auth.controller';
import Controller from './models/controller';
import { appConfig } from './config';
import ProductController from './controllers/product.controller';

const app = express();
const server = new RestServer(app, AppDataSource, appConfig);

const controllers: Controller[] = [
  new AuthController(),
  new ProductController(),
];

const globalMiddleware: RequestHandler[] = [
  urlencoded({ extended: false }),
  json(),
];

if (process.env.NODE_ENV === 'development') {
  globalMiddleware.push(morgan('dev'));
}

async function bootstrap() {
  await server.initDatabase();

  server.loadGlobalMiddleware(globalMiddleware);
  server.loadControllers(controllers);
  server.run();
}

bootstrap();
