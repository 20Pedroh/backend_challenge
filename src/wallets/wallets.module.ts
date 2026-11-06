
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Wallet as WalletEntity } from './entities/wallet.entity.js';
import { LedgerEntry } from './entities/ledger-entry.entity.js';
import { MikroOrmWalletRepository } from './infrastructure/persistence/mikro-orm-wallet.repository.js';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case.js';
import { GetWalletUseCase } from './application/use-cases/get-wallet.use-case.js';
import { WalletsController } from './presentation/wallets.controller.js';
import { CreditWalletUseCase } from './application/use-cases/credit-wallet.use-case.js';
import { MikroOrmWalletTransactionRepository } from './infrastructure/persistence/mikro-orm-wallet-transaction.repository.js';
import { DebitWalletUseCase } from './application/use-cases/debit-wallet.use-case.js';

@Module({
  imports: [MikroOrmModule.forFeature([WalletEntity, LedgerEntry])],
  controllers: [WalletsController],
  providers: [
    MikroOrmWalletRepository,
    MikroOrmWalletTransactionRepository,
    CreateWalletUseCase,
    GetWalletUseCase,
    CreditWalletUseCase,
    DebitWalletUseCase,
    {
      provide: 'WalletRepository',
      useExisting: MikroOrmWalletRepository,
    },
    {
      provide: 'WalletTransactionRepository',
      useExisting: MikroOrmWalletTransactionRepository,
    },
  ],
  exports: [
    'WalletRepository',
    'WalletTransactionRepository',
    GetWalletUseCase,
    CreditWalletUseCase,
    DebitWalletUseCase,
  ],
})
export class WalletsModule {}
