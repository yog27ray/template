import { injectable } from 'inversify';
import { Base } from './base';
import { modelContainer, serviceContainer } from './inversify';
import { Model } from './model';

@injectable()
abstract class Service extends Base {
  getModel<T extends Model>(table: new () => T): T {
    return modelContainer.get(table);
  }

  getService<T extends Service>(table: new () => T): T {
    return serviceContainer.get(table);
  }
}

export { Service };
