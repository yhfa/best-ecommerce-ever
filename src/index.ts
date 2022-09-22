import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { appConfig } from './config';
import ProductController from './controllers/product.controller';
const app = express();
const server = new ResetServer(app, AppDataSource, appConfig);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port http://127.0.0.1:${port}`);
});