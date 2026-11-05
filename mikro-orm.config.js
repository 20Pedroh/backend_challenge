import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

const config = {
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  dbName: process.env.DATABASE_NAME ?? 'financial_db',
  user: process.env.DATABASE_USER ?? 'financial_user',
  password: process.env.DATABASE_PASSWORD ?? 'financial_password',
  entities: ['dist/**/*.entity.js'],
  extensions: [Migrator],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
};

export default config;
