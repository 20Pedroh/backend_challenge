
import { Money } from '../../shared/domain/value-objects/money.js';

export class Wallet {
  private constructor(
    public readonly id: string,
    public readonly playerId: string,
    private currentBalance: Money,
    private currentVersion: number,
  ) {}

  static create(
    id: string,
    playerId: string,
    currency: string,
  ): Wallet {
    if (!playerId.trim()) {
      throw new Error('Player ID is required');
    }

    return new Wallet(
      id,
      playerId,
      Money.zero(currency),
      0,
    );
  }

  static restore(
    id: string,
    playerId: string,
    balance: Money,
    version: number,
  ): Wallet {
    if (!Number.isInteger(version) || version < 0) {
      throw new Error('Invalid wallet version');
    }

    return new Wallet(id, playerId, balance, version);
  }

  get balance(): Money {
    return this.currentBalance;
  }

  get version(): number {
    return this.currentVersion;
  }

  credit(amount: Money): void {
    this.ensurePositiveAmount(amount);
    this.currentBalance = this.currentBalance.add(amount);
    this.currentVersion++;
  }

  debit(amount: Money): void {
    this.ensurePositiveAmount(amount);

    if (this.currentBalance.isLessThan(amount)) {
      throw new Error('Insufficient wallet balance');
    }

    this.currentBalance = this.currentBalance.subtract(amount);
    this.currentVersion++;
  }

  private ensurePositiveAmount(amount: Money): void {
    if (amount.isNegative() || amount.isEqual(Money.zero(amount.currency))) {
      throw new Error('Amount must be greater than zero');
    }

    if (amount.currency !== this.currentBalance.currency) {
      throw new Error('Wallet currency mismatch');
    }
  }
}
