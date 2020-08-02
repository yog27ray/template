import { injectable } from 'inversify';
import { Base } from './base';

@injectable()
abstract class Subscription extends Base {
  abstract initialize(): void;
}

export { Subscription };
