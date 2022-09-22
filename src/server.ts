import {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { DataSource } from 'typeorm';

import Controller from './models/controller';
import { HttpError } from './models/errors';
import { ServerConfig } from './models/interfaces';

class RestServer {
  private readonly _apiVersionUrl = '/api/v1';

  constructor(
    private _app: Application,
    private _database: DataSource,
    private _config?: ServerConfig
  ) {}

  run() {
    const port = this._config.port || 3000;

    return this._app.listen(port, () => {
      console.log(`Application is running on port ${port}`);
    });
  }

  loadGlobalMiddleware(middlewares: RequestHandler[]) {
    // global stuff like cors, body-parser, etc
    middlewares.forEach(middleware => {
      this._app.use(middleware);
    });
  }

  loadControllers(controllers: Controller[]) {
    controllers.forEach(controller => {
      // use setRoutes method that maps routes and returns Router object
      this._app.use(
        this._apiVersionUrl + controller.path,
        controller.setRoutes()
      );
    });

    // Set the default error handler
    this._app.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        console.error('Error 💥 ', error);

        if (res.headersSent) {
          return next(error);
        }

        if (error instanceof HttpError) {
          res.status(error.code);
          res.json({
            status: 'error',
            message: error.message,
          });
        }
      }
    );
  }

  async initDatabase() {
    await this._database.initialize();
  }
}

export default RestServer;
