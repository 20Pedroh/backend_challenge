
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { Money } from '../../../shared/domain/value-objects/money.js';
import type { WalletTransactionRepository } from '../ports/wallet-transaction.repository.js';

@Injectable()
export class CreditWalletUseCase {
  constructor(
    @Inject('WalletTransactionRepository')
    private readonly transactionRepository: WalletTransactionRepository,
  ) {}

  async execute(
    walletId: string,
    amount: string,
    currency: string,
  ) {
    let money: Money;

    try {
      money = Money.create(amount, currency);
    } catch {
      throw new BadRequestException('Invalid monetary amount or currency');
    }

    const transactionId = randomUUID();

    try {
      const wallet = await this.transactionRepository.credit(
        walletId,
        money,
        transactionId,
      );

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      return {
        transactionId,
        walletId: wallet.id,
        playerId: wallet.playerId,
        currency: wallet.balance.currency,
        amount: money.toString(),
        balance: wallet.balance.toString(),
        version: wallet.version,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error instanceof Error) {
        if (
          error.message === 'Amount must be positive' ||
          error.message === 'Insufficient wallet balance'
        ) {
          throw new BadRequestException(error.message);
        }
      }

      throw error;
    }
  }
}
