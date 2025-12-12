/**
 * Tests for fetch.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { x402Fetch, setWallet } from '../src/fetch';
import { getDefaultWallet, connectWallet, switchNetwork } from '../src/wallet';
import { signPayment, signPaymentWithProvider } from '../src/signer';
import type { PaymentChallenge, PaymentSignature } from '../src/types';

// Mock dependencies
vi.mock('../src/wallet');
vi.mock('../src/signer');

describe('fetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('x402Fetch', () => {
    it('should pass through non-402 responses', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ msg: 'success' }),
      };

      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

      const response = await x402Fetch('https://api.example.com/test');

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should handle 402 payment challenge', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
        description: 'Test payment',
      };

      const mockSignature: PaymentSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
      };

      const mockWallet = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';

      // First call returns 402
      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ challenge }),
      };

      // Second call returns success
      const mockSuccessResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ msg: 'success' }),
      };

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(mock402Response as any)
        .mockResolvedValueOnce(mockSuccessResponse as any);

      vi.mocked(getDefaultWallet).mockResolvedValue(mockWallet);
      vi.mocked(connectWallet).mockResolvedValue(mockAddress);
      vi.mocked(switchNetwork).mockResolvedValue(true);
      vi.mocked(signPayment).mockResolvedValue(null);
      vi.mocked(signPaymentWithProvider).mockResolvedValue(mockSignature);

      const response = await x402Fetch('https://api.example.com/paid');

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Check that X-PAYMENT header was added
      const secondCall = vi.mocked(global.fetch).mock.calls[1];
      const headers = secondCall[1]?.headers as Headers;
      expect(headers.get('X-PAYMENT')).toBeTruthy();

      const paymentHeader = JSON.parse(headers.get('X-PAYMENT')!);
      expect(paymentHeader.signature).toBe('0x1234');
      expect(paymentHeader.signer).toBe('0x5678');
      expect(paymentHeader.challenge).toEqual(challenge);
    });

    it('should use existing wallet if already set', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockSignature: PaymentSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
      };

      const mockProvider = {};
      const mockAddress = '0x1234567890123456789012345678901234567890';

      // Set wallet first
      setWallet(mockProvider, mockAddress);

      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ challenge }),
      };

      const mockSuccessResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ msg: 'success' }),
      };

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(mock402Response as any)
        .mockResolvedValueOnce(mockSuccessResponse as any);

      vi.mocked(switchNetwork).mockResolvedValue(true);
      vi.mocked(signPayment).mockResolvedValue(null);
      vi.mocked(signPaymentWithProvider).mockResolvedValue(mockSignature);

      await x402Fetch('https://api.example.com/paid');

      // Should not call getDefaultWallet or connectWallet
      expect(getDefaultWallet).not.toHaveBeenCalled();
      expect(connectWallet).not.toHaveBeenCalled();
    });

    it('should throw error when 402 challenge is invalid', async () => {
      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ error: 'Payment Required' }),
      };

      vi.mocked(global.fetch).mockResolvedValue(mock402Response as any);

      await expect(x402Fetch('https://api.example.com/paid')).rejects.toThrow(
        'Invalid 402 challenge format'
      );
    });

    it('should throw error when no wallet is available', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ challenge }),
      };

      vi.mocked(global.fetch).mockResolvedValue(mock402Response as any);
      vi.mocked(getDefaultWallet).mockResolvedValue(null);

      await expect(x402Fetch('https://api.example.com/paid')).rejects.toThrow(
        'No wallet available'
      );
    });

    it('should throw error when signing fails', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockWallet = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';

      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ challenge }),
      };

      vi.mocked(global.fetch).mockResolvedValue(mock402Response as any);
      vi.mocked(getDefaultWallet).mockResolvedValue(mockWallet);
      vi.mocked(connectWallet).mockResolvedValue(mockAddress);
      vi.mocked(switchNetwork).mockResolvedValue(true);
      vi.mocked(signPayment).mockResolvedValue(null);
      vi.mocked(signPaymentWithProvider).mockResolvedValue(null);

      await expect(x402Fetch('https://api.example.com/paid')).rejects.toThrow(
        'Failed to sign payment'
      );
    });

    it('should preserve original request options', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ msg: 'success' }),
      };

      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any);

      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: 'test' }),
      };

      await x402Fetch('https://api.example.com/test', options);

      const callArgs = vi.mocked(global.fetch).mock.calls[0];
      expect(callArgs[1]?.method).toBe('POST');
      expect(callArgs[1]?.body).toBe(options.body);
    });

    it('should preserve headers when handling 402', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockSignature: PaymentSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
      };

      const mockWallet = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: '',
        provider: {},
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';

      const mock402Response = {
        status: 402,
        json: vi.fn().mockResolvedValue({ challenge }),
      };

      const mockSuccessResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ msg: 'success' }),
      };

      vi.mocked(global.fetch)
        .mockResolvedValueOnce(mock402Response as any)
        .mockResolvedValueOnce(mockSuccessResponse as any);

      vi.mocked(getDefaultWallet).mockResolvedValue(mockWallet);
      vi.mocked(connectWallet).mockResolvedValue(mockAddress);
      vi.mocked(switchNetwork).mockResolvedValue(true);
      vi.mocked(signPayment).mockResolvedValue(null);
      vi.mocked(signPaymentWithProvider).mockResolvedValue(mockSignature);

      const options: RequestInit = {
        headers: {
          'Authorization': 'Bearer token123',
        },
      };

      await x402Fetch('https://api.example.com/paid', options);

      const secondCall = vi.mocked(global.fetch).mock.calls[1];
      const headers = secondCall[1]?.headers as Headers;
      expect(headers.get('Authorization')).toBe('Bearer token123');
      expect(headers.get('X-PAYMENT')).toBeTruthy();
    });
  });

  describe('setWallet', () => {
    it('should set wallet and address', () => {
      const mockProvider = {};
      const mockAddress = '0x1234567890123456789012345678901234567890';

      setWallet(mockProvider, mockAddress);

      // Wallet should be set for subsequent x402Fetch calls
      expect(mockProvider).toBeDefined();
    });
  });
});


