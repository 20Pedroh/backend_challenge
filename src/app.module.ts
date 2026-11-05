
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { Wallet } from './wallets/entities/wallet.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 5432),
      dbName: process.env.DATABASE_NAME ?? 'financial_db',
      user: process.env.DATABASE_USER ?? 'financial_user',
      password: process.env.DATABASE_PASSWORD ?? 'financial_password',

      entities: [Wallet],

      extensions: [Migrator],

      migrations: {
        path: './dist/migrations',
        pathTs: './src/migrations',
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
