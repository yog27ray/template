import { injectable } from 'inversify';
import { Base } from './base';
import { modelContainer, serviceContainer } from './inversify';

@injectable()
abstract class Service extends Base {
  getModel<T>(table: new () => T): T {
    return modelContainer.get(table);
  }

  getService<T>(table: new () => T): T {
    return serviceContainer.get(table);
  }
}

export { Service };
