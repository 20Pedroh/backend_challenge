
import { describe, expect, it } from 'bun:test';
import { Money } from './money.js';

describe('Money', () => {
    // deve criar um valor monetário
  it('should create a monetary value', () => {
    const money = Money.create('100.50', 'BRL');

    expect(money.toString()).toBe('100.50');
    expect(money.currency).toBe('BRL');
  });

    // deve adicionar valores sem erros de precisão de ponto flutuante
  it('should add values without floating-point precision errors', () => {
    const first = Money.create('0.10', 'BRL');
    const second = Money.create('0.20', 'BRL');

    expect(first.add(second).toString()).toBe('0.30');
  });

    // deve subtrair valores corretamente
  it('should subtract values correctly', () => {
    const first = Money.create('10.00', 'BRL');
    const second = Money.create('3.50', 'BRL');

    expect(first.subtract(second).toString()).toBe('6.50');
  });

  // deve não mutar o valor original
  it('should not mutate the original value', () => {
    const original = Money.create('10.00', 'BRL');

    original.add(Money.create('5.00', 'BRL'));

    expect(original.toString()).toBe('10.00');
  });

  // deve rejeitar operações com moedas diferentes
  it('should reject operations with different currencies', () => {
    const brl = Money.create('10.00', 'BRL');
    const usd = Money.create('10.00', 'USD');

    expect(() => brl.add(usd)).toThrow();
    expect(() => brl.subtract(usd)).toThrow();
  });

  // deve rejeitar códigos de moeda inválidos
  it('should reject invalid currency codes', () => {
    expect(() => Money.create('10.00', 'BR')).toThrow();
    expect(() => Money.create('10.00', 'BRL1')).toThrow();
  });

  // deve rejeitar valores monetários inválidos
  it('should reject amounts with more than two decimal places', () => {
    expect(() => Money.create('10.123', 'BRL')).toThrow();
  });

  it('should identify negative values', () => {
    const money = Money.create('-10.00', 'BRL');

    expect(money.isNegative()).toBe(true);
  });

  // deve comparar valores monetarios
  it('should compare monetary values', () => {
    const first = Money.create('10.00', 'BRL');
    const second = Money.create('15.00', 'BRL');

    expect(second.isGreaterThan(first)).toBe(true);
    expect(first.isLessThan(second)).toBe(true);
    expect(first.isEqual(Money.create('10.00', 'BRL'))).toBe(true);
  });

  // deve criar zero com a moeda especificada
  it('should create zero with the specified currency', () => {
    const money = Money.zero('BRL');

    expect(money.toString()).toBe('0.00');
    expect(money.currency).toBe('BRL');
  });
});
