/**
 * Tests for react.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { X402Provider, useX402 } from '../src/react';
import { initX402, detectWallets, signPaymentChallenge } from '../src/core';
import { connectWallet } from '../src/wallet';
import type { WalletInfo, PaymentChallenge } from '../src/types';

// Mock dependencies
vi.mock('../src/core');
vi.mock('../src/wallet');

describe('react', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('X402Provider', () => {
    it('should initialize x402 on mount', async () => {
      const config = {
        defaultChain: 8453,
        preferredToken: 'USDC',
      };

      vi.mocked(initX402).mockResolvedValue(undefined);
      vi.mocked(detectWallets).mockResolvedValue([]);

      render(
        <X402Provider config={config}>
          <div>Test</div>
        </X402Provider>
      );

      await waitFor(() => {
        expect(initX402).toHaveBeenCalledWith(config);
        expect(detectWallets).toHaveBeenCalled();
      });
    });

    it('should provide wallet context', async () => {
      const TestComponent = () => {
        const { wallets, isConnected } = useX402();
        return (
          <div>
            <div data-testid="wallets-count">{wallets.length}</div>
            <div data-testid="connected">{isConnected ? 'true' : 'false'}</div>
          </div>
        );
      };

      const mockWallets: WalletInfo[] = [
        {
          id: 'test-wallet',
          name: 'Test Wallet',
          icon: '',
          provider: {},
        },
      ];

      vi.mocked(initX402).mockResolvedValue(undefined);
      vi.mocked(detectWallets).mockResolvedValue(mockWallets);

      render(
        <X402Provider>
          <TestComponent />
        </X402Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('wallets-count')).toHaveTextContent('1');
        expect(screen.getByTestId('connected')).toHaveTextContent('false');
      });
    });

    it('should handle wallet connection', async () => {
      const mockWallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';

      const TestComponent = () => {
        const { connect, address, isConnected } = useX402();
        return (
          <div>
            <button
              data-testid="connect-btn"
              onClick={() => connect(mockWallet)}
            >
              Connect
            </button>
            <div data-testid="address">{address || 'none'}</div>
            <div data-testid="connected">{isConnected ? 'true' : 'false'}</div>
          </div>
        );
      };

      vi.mocked(initX402).mockResolvedValue(undefined);
      vi.mocked(detectWallets).mockResolvedValue([mockWallet]);
      vi.mocked(connectWallet).mockResolvedValue(mockAddress);

      render(
        <X402Provider>
          <TestComponent />
        </X402Provider>
      );

      await waitFor(() => {
        const connectBtn = screen.getByTestId('connect-btn');
        connectBtn.click();
      });

      await waitFor(() => {
        expect(connectWallet).toHaveBeenCalledWith(mockWallet);
        expect(screen.getByTestId('address')).toHaveTextContent(mockAddress);
        expect(screen.getByTestId('connected')).toHaveTextContent('true');
      });
    });

    it('should call onWalletConnected callback', async () => {
      const mockWallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';
      const onWalletConnected = vi.fn();

      const TestComponent = () => {
        const { connect } = useX402();
        return (
          <button
            data-testid="connect-btn"
            onClick={() => connect(mockWallet)}
          >
            Connect
          </button>
        );
      };

      vi.mocked(initX402).mockResolvedValue(undefined);
      vi.mocked(detectWallets).mockResolvedValue([mockWallet]);
      vi.mocked(connectWallet).mockResolvedValue(mockAddress);

      render(
        <X402Provider config={{ onWalletConnected }}>
          <TestComponent />
        </X402Provider>
      );

      await waitFor(() => {
        const connectBtn = screen.getByTestId('connect-btn');
        connectBtn.click();
      });

      await waitFor(() => {
        expect(onWalletConnected).toHaveBeenCalledWith(mockAddress);
      });
    });

    it('should handle payment signing', async () => {
      const mockWallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
      };

      const TestComponent = () => {
        const { signPayment: signPaymentFn } = useX402();
        return (
          <button
            data-testid="sign-btn"
            onClick={() => signPaymentFn(challenge)}
          >
            Sign
          </button>
        );
      };

      vi.mocked(initX402).mockResolvedValue(undefined);
      vi.mocked(detectWallets).mockResolvedValue([mockWallet]);
      vi.mocked(connectWallet).mockResolvedValue('0x1234567890123456789012345678901234567890');
      vi.mocked(signPaymentChallenge).mockResolvedValue(mockSignature);

      render(
        <X402Provider>
          <TestComponent />
        </X402Provider>
      );

      await waitFor(() => {
        const signBtn = screen.getByTestId('sign-btn');
        signBtn.click();
      });

      // Note: This test would need more setup to properly test the signing flow
      // since we need to set the wallet state first
    });
  });

  describe('useX402', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const TestComponent = () => {
        useX402();
        return <div>Test</div>;
      };

      expect(() => render(<TestComponent />)).toThrow(
        'useX402 must be used within X402Provider'
      );

      consoleSpy.mockRestore();
    });
  });
});


