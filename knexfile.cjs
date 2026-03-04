require('dotenv').config();

const connection = process.env.DATABASE_URL
  ? {
      connection: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'fya_credits',
      },
    };

module.exports = {
  development: {
    client: 'pg',
    ...connection,
    migrations: {
      directory: './migrations',
      extension: 'js',
    },
    seeds: {
      directory: './seeds',
      extension: 'js',
    },
  },
};
