
import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Wallet as DomainWallet } from '../../domain/wallet.js';
import { Wallet as WalletEntity } from '../../../wallets/entities/wallet.entity.js';
import { Money } from '../../../shared/domain/value-objects/money.js';
import { WalletRepository } from '../../application/ports/wallet.repository.js';

@Injectable()
export class MikroOrmWalletRepository implements WalletRepository {
  constructor(private readonly em: EntityManager) {}

  async findById(id: string): Promise<DomainWallet | null> {
    const entity = await this.em.findOne(WalletEntity, { id });

    return entity ? this.toDomain(entity) : null;
  }

  async findByPlayerAndCurrency(
    playerId: string,
    currency: string,
  ): Promise<DomainWallet | null> {
    const entity = await this.em.findOne(WalletEntity, {
      playerId,
      currency,
    });

    return entity ? this.toDomain(entity) : null;
  }

  async save(wallet: DomainWallet): Promise<void> {
    const entity = await this.em.findOne(WalletEntity, {
      id: wallet.id,
    });

    if (entity) {
      entity.balance = wallet.balance.toString();
      entity.version = wallet.version;
    } else {
      const newEntity = this.em.create(WalletEntity, {
        id: wallet.id,
        playerId: wallet.playerId,
        currency: wallet.balance.currency,
        balance: wallet.balance.toString(),
        version: wallet.version,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      this.em.persist(newEntity);
    }

    await this.em.flush();
  }

  private toDomain(entity: WalletEntity): DomainWallet {
    return DomainWallet.restore(
      entity.id,
      entity.playerId,
      Money.create(entity.balance, entity.currency),
      entity.version,
    );
  }
}
