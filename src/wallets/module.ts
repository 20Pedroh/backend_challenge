
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Wallet as WalletEntity } from './entities/wallet.entity.js';
import { MikroOrmWalletRepository } from './infrastructure/persistence/mikro-orm-wallet.repository.js';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case.js';
import { WalletsController } from './presentation/wallets.controller.js';

@Module({
  imports: [MikroOrmModule.forFeature([WalletEntity])],
  controllers: [WalletsController],
  providers: [
    MikroOrmWalletRepository,
    CreateWalletUseCase,
    {
      provide: 'WalletRepository',
      useExisting: MikroOrmWalletRepository,
    },
  ],
  exports: ['WalletRepository'],
})
export class WalletsModule {}
