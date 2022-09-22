import { Router } from 'express';
import { IRoute, Methods } from './interfaces';

export default abstract class Controller {
  // Router instance for mapping routes
  router = Router();
  // The path on which this.routes will be mapped
  abstract path: string;
  // Array of objects which implement IRoutes interface
  protected abstract readonly routes?: IRoute[];

  setRoutes = (): Router => {
    // Set HTTP method, middleware, and handler for each route
    // Returns Router object, which we will use in Server class
    for (const route of this.routes) {
      if (route.localMiddleware) {
        for (const mw of route.localMiddleware) {
          this.router.use(route.path, mw);
        }
      }
      switch (route.method) {
        case Methods.GET:
          this.router.get(route.path, route.handler);
          break;
        case Methods.POST:
          this.router.post(route.path, route.handler);
          break;
        case Methods.PUT:
          this.router.put(route.path, route.handler);
          break;
        case Methods.DELETE:
          this.router.delete(route.path, route.handler);
          break;
        default:
          throw new Error('No HTTP vaild method');
      }
    }
    // Return router instance (will be usable in Server class)
    return this.router;
  };
}
