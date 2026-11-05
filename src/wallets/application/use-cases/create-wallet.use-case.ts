
import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Wallet } from '../../domain/wallet.js';
import type { WalletRepository } from '../ports/wallet.repository.js';

@Injectable()
export class CreateWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(
    playerId: string,
    currency: string,
  ): Promise<Wallet> {
    const existingWallet =
      await this.walletRepository.findByPlayerAndCurrency(
        playerId,
        currency,
      );

    // erro para impedir a criaçao de uma carteira duplicada para o mesmo jogador
    if (existingWallet) {
      throw new Error('Wallet already exists for this player and currency');
    }

    const wallet = Wallet.create(
      randomUUID(),
      playerId,
      currency,
    );

    await this.walletRepository.save(wallet);

    return wallet;
  }
}
