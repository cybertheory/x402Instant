/**
 * Tests for wallet.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { detectWallets, getDefaultWallet, connectWallet, switchNetwork } from '../src/wallet';
import type { WalletInfo } from '../src/types';

describe('wallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window.ethereum
    (window as any).ethereum = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectWallets', () => {
    it('should return empty array when no wallets are available', async () => {
      const wallets = await detectWallets();
      expect(wallets).toEqual([]);
    });

    it('should detect window.ethereum (legacy)', async () => {
      const mockProvider = {
        request: vi.fn(),
        isMetaMask: true,
      };

      (window as any).ethereum = mockProvider;

      const wallets = await detectWallets();

      expect(wallets.length).toBeGreaterThan(0);
      const metamaskWallet = wallets.find((w) => w.name === 'MetaMask');
      expect(metamaskWallet).toBeDefined();
      expect(metamaskWallet?.provider).toBe(mockProvider);
    });

    it('should detect Coinbase Wallet', async () => {
      const mockProvider = {
        request: vi.fn(),
        isCoinbaseWallet: true,
      };

      (window as any).ethereum = mockProvider;

      const wallets = await detectWallets();

      expect(wallets.length).toBeGreaterThan(0);
      const coinbaseWallet = wallets.find((w) => w.name === 'Coinbase Wallet');
      expect(coinbaseWallet).toBeDefined();
    });

    it('should detect generic injected wallet', async () => {
      const mockProvider = {
        request: vi.fn(),
      };

      (window as any).ethereum = mockProvider;

      const wallets = await detectWallets();

      expect(wallets.length).toBeGreaterThan(0);
      const injectedWallet = wallets.find((w) => w.name === 'Injected Wallet');
      expect(injectedWallet).toBeDefined();
    });

    it('should set up EIP-6963 event listeners and request providers', async () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

      await detectWallets();

      // Verify that addEventListener was called for EIP-6963
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'eip6963:announceProvider',
        expect.any(Function)
      );

      // Verify that requestProvider event was dispatched
      expect(dispatchEventSpy).toHaveBeenCalled();
      const dispatchCalls = dispatchEventSpy.mock.calls;
      const requestProviderCall = dispatchCalls.find(
        (call) => (call[0] as Event).type === 'eip6963:requestProvider'
      );
      expect(requestProviderCall).toBeDefined();

      addEventListenerSpy.mockRestore();
      dispatchEventSpy.mockRestore();
    });

    it('should wait for EIP-6963 announcements', async () => {
      vi.useFakeTimers();

      const walletsPromise = detectWallets();

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(100);

      const wallets = await walletsPromise;

      expect(wallets).toBeDefined();
      vi.useRealTimers();
    });
  });

  describe('getDefaultWallet', () => {
    it('should return null when no wallets are available', async () => {
      const wallet = await getDefaultWallet();
      expect(wallet).toBeNull();
    });

    it('should return first wallet when available', async () => {
      const mockProvider = {
        request: vi.fn(),
      };

      (window as any).ethereum = mockProvider;

      const wallet = await getDefaultWallet();

      expect(wallet).not.toBeNull();
      expect(wallet?.provider).toBe(mockProvider);
    });
  });

  describe('connectWallet', () => {
    it('should connect wallet and return address', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      const mockProvider = {
        request: vi.fn().mockResolvedValue([mockAddress]),
      };

      const wallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: mockProvider,
      };

      const address = await connectWallet(wallet);

      expect(address).toBe(mockAddress);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });
    });

    it('should return null when connection fails', async () => {
      const mockProvider = {
        request: vi.fn().mockRejectedValue(new Error('User rejected')),
      };

      const wallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: mockProvider,
      };

      const address = await connectWallet(wallet);

      expect(address).toBeNull();
    });

    it('should return null when no accounts are returned', async () => {
      const mockProvider = {
        request: vi.fn().mockResolvedValue([]),
      };

      const wallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: mockProvider,
      };

      const address = await connectWallet(wallet);

      expect(address).toBeNull();
    });
  });

  describe('switchNetwork', () => {
    it('should return true when already on correct network', async () => {
      const mockProvider = {
        request: vi.fn().mockResolvedValue('0x2105'), // 8453 in hex
      };

      const result = await switchNetwork(mockProvider, 8453);

      expect(result).toBe(true);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'eth_chainId',
      });
    });

    it('should switch to correct network', async () => {
      const mockProvider = {
        request: vi
          .fn()
          .mockResolvedValueOnce('0x1') // Mainnet
          .mockResolvedValueOnce(undefined), // switchEthereumChain success
      };

      const result = await switchNetwork(mockProvider, 8453);

      expect(result).toBe(true);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }],
      });
    });

    it('should return false when chain is not added (4902 error)', async () => {
      const mockProvider = {
        request: vi
          .fn()
          .mockResolvedValueOnce('0x1') // Mainnet
          .mockRejectedValueOnce({ code: 4902 }), // Chain not added
      };

      const result = await switchNetwork(mockProvider, 8453);

      expect(result).toBe(false);
    });

    it('should throw error for other switch errors', async () => {
      const mockProvider = {
        request: vi
          .fn()
          .mockResolvedValueOnce('0x1') // Mainnet
          .mockRejectedValueOnce(new Error('Switch failed')),
      };

      await expect(switchNetwork(mockProvider, 8453)).rejects.toThrow(
        'Switch failed'
      );
    });

    it('should return false when chainId request fails', async () => {
      const mockProvider = {
        request: vi.fn().mockRejectedValue(new Error('Failed to get chainId')),
      };

      const result = await switchNetwork(mockProvider, 8453);

      expect(result).toBe(false);
    });
  });
});

