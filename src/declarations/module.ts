import { injectable } from 'inversify';
import { Base } from './base';

@injectable()
abstract class Module extends Base {
}

export { Module };
