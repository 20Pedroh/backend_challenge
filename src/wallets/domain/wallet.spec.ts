
import { describe, expect, it } from 'bun:test';
import { Wallet } from './wallet.js';
import { Money } from '../../shared/domain/value-objects/money.js';

describe('Wallet', () => {
  const createWallet = () =>
    Wallet.create('wallet-1', 'player-1', 'BRL');

  // deve criar uma carteira com saldo zero
  it('should create a wallet with zero balance', () => {
    const wallet = createWallet();

    expect(wallet.balance.toString()).toBe('0.00');
    expect(wallet.balance.currency).toBe('BRL');
    expect(wallet.version).toBe(0);
  });

  // deve rejeitar um ID de jogador vazio
  it('should reject an empty player ID', () => {
    expect(() => Wallet.create('wallet-1', ' ', 'BRL')).toThrow();
  });

  //
  it('should credit the wallet', () => {
    const wallet = createWallet();

    wallet.credit(Money.create('100.00', 'BRL'));

    expect(wallet.balance.toString()).toBe('100.00');
    expect(wallet.version).toBe(1);
  });

  // deve debitar a carteira
  it('should debit the wallet', () => {
    const wallet = createWallet();

    wallet.credit(Money.create('100.00', 'BRL'));
    wallet.debit(Money.create('30.00', 'BRL'));

    expect(wallet.balance.toString()).toBe('70.00');
    expect(wallet.version).toBe(2);
  });

  // deve rejeitar quando o saldo for insuficiente
  it('should reject debit when balance is insufficient', () => {
    const wallet = createWallet();

    expect(() =>
      wallet.debit(Money.create('10.00', 'BRL')),
    ).toThrow('Insufficient wallet balance');
  });

  // deve rejeitar crédito negativo
  it('should reject negative credit', () => {
    const wallet = createWallet();

    expect(() =>
      wallet.credit(Money.create('-10.00', 'BRL')),
    ).toThrow();
  });

  // deve rejeitar crédito zero
  it('should reject zero credit', () => {
    const wallet = createWallet();

    expect(() =>
      wallet.credit(Money.create('0.00', 'BRL')),
    ).toThrow();
  });

  // deve rejeitar débito negativo
  it('should reject operations with a different currency', () => {
    const wallet = createWallet();

    expect(() =>
      wallet.credit(Money.create('10.00', 'USD')),
    ).toThrow();
  });

  // deve restaurar uma carteira com seu estado persistido
  it('should restore a wallet with its persisted state', () => {
    const wallet = Wallet.restore(
      'wallet-1',
      'player-1',
      Money.create('250.00', 'BRL'),
      5,
    );

    expect(wallet.balance.toString()).toBe('250.00');
    expect(wallet.version).toBe(5);
  });

  // deve rejeitar uma versão restaurada inválida
  it('should reject an invalid restored version', () => {
    expect(() =>
      Wallet.restore(
        'wallet-1',
        'player-1',
        Money.create('250.00', 'BRL'),
        -1,
      ),
    ).toThrow('Invalid wallet version');
  });
});
