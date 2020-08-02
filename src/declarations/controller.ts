import { RequestHandler } from 'express';
import { injectable } from 'inversify';
import { Base } from './base';
import { serviceContainer } from './inversify';
import { Service } from './service';

declare interface RouteType {
  middleware?: Array<RequestHandler>;
  method?: string;
  path: string;
}

@injectable()
abstract class Controller extends Base {
  abstract generateRoutes(): Array<RouteType>;

  getService<T extends Service>(table: new () => T): T {
    return serviceContainer.get(table);
  }
}

export { Controller, RouteType };
