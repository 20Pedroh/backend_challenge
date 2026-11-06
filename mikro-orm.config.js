import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Wallet } from './src/wallets/entities/wallet.entity.js';
import { LedgerEntry } from './src/wallets/entities/ledger-entry.entity.js';
import { IdempotencyRecord } from './src/wallets/entities/idempotency-record.entity.js';
import { FinancialTransaction } from './src/wallets/entities/financial-transaction.entity.js';

const config = {
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  dbName: process.env.DATABASE_NAME ?? 'financial_db',
  user: process.env.DATABASE_USER ?? 'financial_user',
  password: process.env.DATABASE_PASSWORD ?? 'financial_password',
  entities: [Wallet, LedgerEntry, IdempotencyRecord, FinancialTransaction],
  extensions: [Migrator],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
};

export default config;
