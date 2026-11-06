
import { Injectable } from '@nestjs/common';
import { LockMode } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

import { Money } from '../../../shared/domain/value-objects/money.js';
import { Wallet as DomainWallet } from '../../domain/wallet.js';
import { Wallet as WalletEntity } from '../../entities/wallet.entity.js';
import { LedgerEntry } from '../../entities/ledger-entry.entity.js';
import type { WalletTransactionRepository } from '../../application/ports/wallet-transaction.repository.js';

@Injectable()
export class MikroOrmWalletTransactionRepository
  implements WalletTransactionRepository
{
  constructor(private readonly em: EntityManager) {}

  async credit(
    walletId: string,
    amount: Money,
    transactionId: string,
  ): Promise<DomainWallet | null> {
    return this.em.transactional(async (tx) => {
      const entity = await tx.findOne(
        WalletEntity,
        { id: walletId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (!entity) {
        return null;
      }

      const wallet = DomainWallet.restore(
        entity.id,
        entity.playerId,
        Money.create(entity.balance, entity.currency),
        entity.version,
      );

      wallet.credit(amount);

      entity.balance = wallet.balance.toString();
      entity.version = wallet.version;
      entity.updatedAt = new Date();

      const ledgerEntry = tx.create(LedgerEntry, {
        walletId: wallet.id,
        transactionId,
        type: 'CREDIT',
        amount: amount.toString(),
        currency: amount.currency,
        balanceAfter: wallet.balance.toString(),
        createdAt: new Date(),
      });

      tx.persist(ledgerEntry);

      await tx.flush();

      return wallet;
    });
  }
}
