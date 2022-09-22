import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port http://127.0.0.1:${port}`);
});
