import { Container } from 'inversify';

const modelContainer = new Container({ autoBindInjectable: true });
const serviceContainer = new Container({ autoBindInjectable: true });
const controllerContainer = new Container({ autoBindInjectable: true });

export { modelContainer, serviceContainer, controllerContainer };
