import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const root = path.normalize(`${__dirname}/../..`);
const envFile = process.env.NODE_ENV === 'test'
  ? path.join(root, 'default.env')
  : path.join(root, '.env');

const setupCompleted = fs.existsSync(envFile);
const variables = setupCompleted
  ? dotenv.config({ path: envFile })
  : {};

const rawEnv: any = variables.parsed || variables;

if (!process.env.DEBUG) {
  process.env.DEBUG = rawEnv.DEBUG;
}

const env = {
  PORT: 8080,
  setupCompleted,
  envFile,
  root,
  ...rawEnv,
  ...process.env,
};

export { env };
