
import { ConflictException, Injectable } from '@nestjs/common';
import { LockMode } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { randomUUID } from 'node:crypto';

import { Money } from '../../../shared/domain/value-objects/money.js';
import { Wallet as DomainWallet } from '../../domain/wallet.js';
import { Wallet as WalletEntity } from '../../entities/wallet.entity.js';
import { LedgerEntry } from '../../entities/ledger-entry.entity.js';
import { IdempotencyRecord } from '../../entities/idempotency-record.entity.js';
import type {
  WalletTransactionResult,
  WalletTransactionRepository,
} from '../../application/ports/wallet-transaction.repository.js';

@Injectable()
export class MikroOrmWalletTransactionRepository
  implements WalletTransactionRepository
{
  constructor(private readonly em: EntityManager) {}

  async credit(
    walletId: string,
    amount: Money,
    transactionId: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<WalletTransactionResult> {
    return this.executeTransaction(
      walletId,
      amount,
      transactionId,
      idempotencyKey,
      requestHash,
      'CREDIT',
    );
  }

  async debit(
    walletId: string,
    amount: Money,
    transactionId: string,
    idempotencyKey: string,
    requestHash: string,
  ): Promise<WalletTransactionResult> {
    return this.executeTransaction(
      walletId,
      amount,
      transactionId,
      idempotencyKey,
      requestHash,
      'DEBIT',
    );
  }

  private async executeTransaction(
    walletId: string,
    amount: Money,
    transactionId: string,
    idempotencyKey: string,
    requestHash: string,
    type: 'CREDIT' | 'DEBIT',
  ): Promise<WalletTransactionResult> {
    return this.em.transactional(async (tx) => {
      const entity = await tx.findOne(
        WalletEntity,
        { id: walletId },
        { lockMode: LockMode.PESSIMISTIC_WRITE },
      );

      if (!entity) {
        return { status: 'not_found' };
      }

      const inserted = await tx.getConnection().execute(
        `INSERT INTO idempotency_records
          (id, key, request_hash, response, created_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT (key) DO NOTHING
         RETURNING id`,
        [randomUUID(), idempotencyKey, requestHash, null, new Date()],
      );

      if (inserted.length === 0) {
        const existing = await tx.findOne(IdempotencyRecord, {
          key: idempotencyKey,
        });

        if (!existing) {
          throw new Error('Idempotency record could not be retrieved');
        }

        if (existing.requestHash !== requestHash) {
          throw new ConflictException(
            'Idempotency key already used with a different request',
          );
        }

        if (!existing.response) {
          throw new Error('Idempotency response is not available');
        }

        return {
          status: 'completed',
          replayed: true,
          response: existing.response as WalletTransactionResult['response'],
        };
      }

      const wallet = DomainWallet.restore(
        entity.id,
        entity.playerId,
        Money.create(entity.balance, entity.currency),
        entity.version,
      );

      if (type === 'CREDIT') {
        wallet.credit(amount);
      } else {
        wallet.debit(amount);
      }

      entity.balance = wallet.balance.toString();
      entity.version = wallet.version;
      entity.updatedAt = new Date();

      const response = {
        transactionId,
        walletId: wallet.id,
        playerId: wallet.playerId,
        currency: wallet.balance.currency,
        amount: amount.toString(),
        balance: wallet.balance.toString(),
        version: wallet.version,
      };

      const ledgerEntry = tx.create(LedgerEntry, {
        walletId: wallet.id,
        transactionId,
        type,
        amount: amount.toString(),
        currency: amount.currency,
        balanceAfter: wallet.balance.toString(),
        createdAt: new Date(),
      });

      const idempotencyRecord = await tx.findOne(IdempotencyRecord, {
        key: idempotencyKey,
      });

      if (!idempotencyRecord) {
        throw new Error('Idempotency record not found after insertion');
      }

      idempotencyRecord.response = response;

      tx.persist(ledgerEntry);

      await tx.flush();

      return {
        status: 'completed',
        replayed: false,
        response,
      };
    });
  }
}
