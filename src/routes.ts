import express, { Express } from 'express';
import { errors } from './config/errors';
import { env } from './config/env';
import { RouteType } from './declarations/controller';

function registerRoutes(app: Express): void {
  // Insert routes below
  // All undefined routes should return a 404
  app.route('/*').get(errors[404]);
}

function registerApplicationRoutes(app: Express, applicationRoutes: Array<RouteType>): void {
  applicationRoutes.forEach((each: RouteType) => {
    const path = each.path;
    const middleware = each.middleware;
    const method = each.method || 'use';
    const router = express.Router();
    router[method.toLowerCase().trim()](path, ...middleware);
    app.use('/api', router);
  });
}

export { registerRoutes, registerApplicationRoutes };
