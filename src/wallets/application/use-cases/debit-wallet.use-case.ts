
import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';

import { Money } from '../../../shared/domain/value-objects/money.js';
import type { WalletTransactionRepository } from '../ports/wallet-transaction.repository.js';

@Injectable()
export class DebitWalletUseCase {
  constructor(
    private readonly transactionRepository: WalletTransactionRepository,
  ) {}

  async execute(
    walletId: string,
    amount: string,
    currency: string,
    idempotencyKey: string,
  ) {
    if (!idempotencyKey?.trim() || idempotencyKey.length > 255) {
      throw new BadRequestException(
        'A valid Idempotency-Key header is required',
      );
    }

    let money: Money;

    try {
      money = Money.create(amount, currency);
    } catch {
      throw new BadRequestException('Invalid monetary amount or currency');
    }

    const requestHash = createHash('sha256')
      .update(JSON.stringify({ walletId, amount, currency }))
      .digest('hex');

    try {
      const result = await this.transactionRepository.debit(
        walletId,
        money,
        randomUUID(),
        idempotencyKey,
        requestHash,
      );

      if (result.status === 'not_found') {
        throw new NotFoundException('Wallet not found');
      }

      return result.response;
    } catch (error) {
      if (error instanceof HttpException) {
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
