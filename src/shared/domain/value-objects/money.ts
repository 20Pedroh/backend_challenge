import { Decimal } from 'decimal.js';

export class Money {
  private constructor(
    private readonly amount: Decimal,
    public readonly currency: string,
  ) {}

  static create(amount: string, currency: string): Money {
    if (!/^[A-Z]{3}$/.test(currency)) {
      throw new Error('Invalid currency. Use a 3-letter ISO currency code.');
    }

    if (!/^-?\d+(\.\d{1,2})?$/.test(amount)) {
      throw new Error('Invalid monetary amount. Maximum 2 decimal places.');
    }

    return new Money(new Decimal(amount), currency);
  }

  static zero(currency: string): Money {
    return Money.create('0.00', currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(this.amount.plus(other.amount), this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(this.amount.minus(other.amount), this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.amount.greaterThan(other.amount);
  }

  isLessThan(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.amount.lessThan(other.amount);
  }

  isEqual(other: Money): boolean {
    this.ensureSameCurrency(other);

    return this.amount.equals(other.amount);
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  toString(): string {
    return this.amount.toFixed(2);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Currency mismatch: ${this.currency} and ${other.currency}`,
      );
    }
  }
}
