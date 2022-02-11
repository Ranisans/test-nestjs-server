import * as path from 'path';
import { ConnectionOptions } from 'typeorm';
import './env';

const ENV = process.env.NODE_ENV;

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const connectionConfig: ConnectionOptions = {
  type: 'postgres',
  name: 'default',
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT, 10),
  username: POSTGRES_USERNAME,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: ENV === 'development',
  migrationsRun: true,
  dropSchema: false,
  entities: [
    path.join('src/database', 'entities', '**', '*.*'),
    path.join('src/database', 'entities', '*.*'),
  ],
  migrations: [path.join('src/database', 'migrations', '*.*')],
  cli: {
    entitiesDir: path.join('src/database', 'entities'),
    migrationsDir: path.join('src/database', 'migrations'),
  },
};

export = connectionConfig;
