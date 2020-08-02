import { injectable } from 'inversify';
import { Base } from './base';

@injectable()
abstract class Model extends Base {
}

export { Model };
