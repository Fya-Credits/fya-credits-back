import type { Knex } from 'knex';
import { env } from './src/config/env';

const connection = env.db.url
  ? { connection: env.db.url, ssl: { rejectUnauthorized: false } }
  : {
      connection: {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.name,
      },
    };

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    ...connection,
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
      extension: 'ts',
    },
  },
};

export default config;
