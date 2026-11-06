
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { WalletRepository } from '../ports/wallet.repository.js';

@Injectable()
export class GetWalletUseCase {
  constructor(
    @Inject('WalletRepository')
    private readonly walletRepository: WalletRepository,
  ) {}

  async execute(id: string) {
    const wallet = await this.walletRepository.findById(id);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      id: wallet.id,
      playerId: wallet.playerId,
      currency: wallet.balance.currency,
      balance: wallet.balance.toString(),
      version: wallet.version,
    };
  }
}
