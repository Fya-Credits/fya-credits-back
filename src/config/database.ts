import knex, { Knex } from 'knex';
import { env } from './env';

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

const config: Knex.Config = {
  client: 'pg',
  ...connection,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../migrations',
    extension: 'ts',
  },
  seeds: {
    directory: '../seeds',
    extension: 'ts',
  },
};

export const db = knex(config);
