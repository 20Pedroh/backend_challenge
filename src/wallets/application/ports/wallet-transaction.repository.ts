import { Money } from '../../../shared/domain/value-objects/money.js';
import { Wallet } from '../../domain/wallet.js';

export interface WalletTransactionRepository {
  credit(
    walletId: string,
    amount: Money,
    transactionId: string,
  ): Promise<Wallet | null>;
}