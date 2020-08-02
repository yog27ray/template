/* eslint-disable */
/**
 * Main application file
 */
import debug from 'debug';
import express from 'express';
import http from 'http';
import { ApplicationModuleType } from './annotation/module';

import { expressConfig } from './config/express';
import { env } from './config/env';
import { AppModule } from './modules';
import { registerApplicationRoutes, registerRoutes } from './routes';

const log = debug('template:App');

// Setup server
const app: express.Express = express();
const server = http.createServer(app);

// Start server
async function startServer(): Promise<any> {
  server.listen(env.PORT, env.ip, () => {
    log('Express server listening on %d, in %s mode', env.PORT, app.get('env'));
  });
}

async function setUpServer(): Promise<any> {
  expressConfig(app);
  registerRoutes(app);
  const ApplicationModule: ApplicationModuleType = AppModule;
  ApplicationModule.loadContainer();
  const applicationRoutes = ApplicationModule.generateRoutes();
  registerApplicationRoutes(app, applicationRoutes);
  ApplicationModule.loadSubscriptions();
  await startServer();
}

process.on('unhandledRejection', (reason: any, promise: any) => {
  log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err: any) => {
  log(err);
});

setUpServer().catch((error: any) => log(error));

// Expose app
export { app };
