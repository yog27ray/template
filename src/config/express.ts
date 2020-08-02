/**
 * Express configuration
 */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import { env as appEnv } from './env';

function expressConfig(app: any): void {
  const env = app.get('env');

  app.set('appPath', path.join(appEnv.root, 'client'));
  app.use(express.static(app.get('appPath')));

  if (env !== 'test' && appEnv.ENABLE_MORGAN === 'true') {
    app.use(morgan('dev'));
  }

  app.set('views', `${appEnv.root}/server/src/views`);
  app.set('view engine', 'pug');

  const corsOptions: { credentials: boolean, origin?: (origin: any, callback: any) => void } = { credentials: true };
  if (appEnv.WHITELISTED_DOMAINS) {
    const whitelist = appEnv.WHITELISTED_DOMAINS.split(',');
    corsOptions.origin = (origin: any, callback: any): void => {
      if (origin === 'null' || !origin || whitelist.includes(origin)) {
        callback(undefined, true);
      } else {
        callback(new Error(`UnAuthorized Access from ${origin}`));
      }
    };
  }
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '10MB', type: 'text/plain' }));
  app.use(bodyParser.json({ limit: '10MB' }));
  app.use(methodOverride());
  app.use(cookieParser());

  app.use(errorHandler()); // Error handler - has to be last
}

export { expressConfig };
