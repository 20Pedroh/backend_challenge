
import { Money } from '../../../shared/domain/value-objects/money.js';

export interface WalletTransactionResult {
  status: 'not_found' | 'completed';
  replayed?: boolean;
  response?: {
    transactionId: string;
    walletId: string;
    playerId: string;
    currency: string;
    amount: string;
    balance: string;
    version: number;
  };
}

export interface WalletTransactionRepository {
  credit(
    walletId: string,
    amount: Money,
    transactionId: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<WalletTransactionResult>;

  debit(
    walletId: string,
    amount: Money,
    transactionId: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<WalletTransactionResult>;
}
