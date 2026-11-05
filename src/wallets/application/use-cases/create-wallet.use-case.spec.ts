
import { describe, expect, it, mock } from 'bun:test';

import { CreateWalletUseCase } from './create-wallet.use-case.js';
import type { WalletRepository } from '../ports/wallet.repository.js';

describe('CreateWalletUseCase', () => {
  const createRepository = (): WalletRepository => ({
    findById: mock(async () => null),
    findByPlayerAndCurrency: mock(async () => null),
    save: mock(async () => {}),
  });

  it('should create a wallet with zero balance', async () => {
    const repository = createRepository();
    const useCase = new CreateWalletUseCase(repository);
    const wallet = await useCase.execute('player-1','BRL');

    expect(wallet.playerId).toBe('player-1');
    expect(wallet.balance.toString()).toBe('0.00');
    expect(wallet.balance.currency).toBe('BRL');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('should reject when the wallet already exists', async () => {
    const repository = createRepository();

    repository.findByPlayerAndCurrency = mock(async () => {
      const { Wallet } = await import('../../domain/wallet.js');

      return Wallet.create('wallet-1', 'player-1','BRL');
    });

    const useCase = new CreateWalletUseCase(repository);

    await expect(
      useCase.execute('player-1','BRL'),
    ).rejects.toThrow(
      'Wallet already exists for this player and currency',
    );

    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should allow the same player to have wallets in different currencies', async () => {
    const repository = createRepository();
    const useCase = new CreateWalletUseCase(repository);
    const brlWallet = await useCase.execute('player-1','BRL');
    const usdWallet = await useCase.execute('player-1','USD');

    expect(brlWallet.balance.currency).toBe('BRL');
    expect(usdWallet.balance.currency).toBe('USD');
    expect(brlWallet.id).not.toBe(usdWallet.id);
  });
});
