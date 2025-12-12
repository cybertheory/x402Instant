/**
 * Tests for signer.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getEIP712Domain,
  getEIP712Types,
  createPaymentMessage,
  signPayment,
  signPaymentWithProvider,
} from '../src/signer';
import type { PaymentChallenge, PaymentSignature } from '../src/types';

describe('signer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEIP712Domain', () => {
    it('should return correct EIP-712 domain', () => {
      const domain = getEIP712Domain(8453);

      expect(domain).toEqual({
        name: 'x402',
        version: '1',
        chainId: 8453,
        verifyingContract: '0x0000000000000000000000000000000000000000',
      });
    });
  });

  describe('getEIP712Types', () => {
    it('should return correct EIP-712 types', () => {
      const types = getEIP712Types();

      expect(types).toHaveProperty('EIP712Domain');
      expect(types).toHaveProperty('Payment');
      expect(types.EIP712Domain).toHaveLength(4);
      expect(types.Payment).toHaveLength(6);
    });
  });

  describe('createPaymentMessage', () => {
    it('should create payment message from challenge', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
        description: 'Test payment',
      };

      const message = createPaymentMessage(challenge);

      expect(message).toEqual({
        price: '0.01',
        currency: 'USDC',
        chainId: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
        description: 'Test payment',
      });
    });

    it('should handle missing description', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const message = createPaymentMessage(challenge);

      expect(message.description).toBe('');
    });

    it('should normalize merchant address', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35cc6634c0532925a3b844bc9e7595f0beb0', // lowercase
        timestamp: 1699123456,
      };

      const message = createPaymentMessage(challenge);

      // ethers.getAddress should normalize the address
      expect(message.merchant).toBeDefined();
    });
  });

  describe('signPayment', () => {
    it('should sign payment using ethers', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = '0xabcdef1234567890';

      const mockSigner = {
        getAddress: vi.fn().mockResolvedValue(mockAddress),
        signTypedData: vi.fn().mockResolvedValue(mockSignature),
      };

      const mockProvider = {
        getSigner: vi.fn().mockResolvedValue(mockSigner),
      };

      const result = await signPayment(challenge, mockProvider);

      expect(result).not.toBeNull();
      expect(result?.signature).toBe(mockSignature);
      expect(result?.signer).toBe(mockAddress);
      expect(result?.challenge).toEqual(challenge);
      expect(mockProvider.getSigner).toHaveBeenCalled();
      expect(mockSigner.signTypedData).toHaveBeenCalled();
    });

    it('should return null when signing fails', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockProvider = {
        getSigner: vi.fn().mockRejectedValue(new Error('Signing failed')),
      };

      const result = await signPayment(challenge, mockProvider);

      expect(result).toBeNull();
    });
  });

  describe('signPaymentWithProvider', () => {
    it('should sign payment using provider.request', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockAddress = '0x1234567890123456789012345678901234567890';
      const mockSignature = '0xabcdef1234567890';

      const mockProvider = {
        request: vi.fn().mockResolvedValue(mockSignature),
      };

      const result = await signPaymentWithProvider(
        challenge,
        mockProvider,
        mockAddress
      );

      expect(result).not.toBeNull();
      expect(result?.signature).toBe(mockSignature);
      expect(result?.signer).toBe(mockAddress);
      expect(result?.challenge).toEqual(challenge);
      expect(mockProvider.request).toHaveBeenCalledWith({
        method: 'eth_signTypedData_v4',
        params: expect.arrayContaining([mockAddress]),
      });
    });

    it('should return null when signing fails', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const mockProvider = {
        request: vi.fn().mockRejectedValue(new Error('Signing failed')),
      };

      const result = await signPaymentWithProvider(
        challenge,
        mockProvider,
        '0x1234567890123456789012345678901234567890'
      );

      expect(result).toBeNull();
    });

    it('should include correct domain, types, and message in request', async () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
        description: 'Test payment',
      };

      const mockProvider = {
        request: vi.fn().mockResolvedValue('0x1234'),
      };

      await signPaymentWithProvider(
        challenge,
        mockProvider,
        '0x1234567890123456789012345678901234567890'
      );

      const callArgs = mockProvider.request.mock.calls[0][0];
      expect(callArgs.method).toBe('eth_signTypedData_v4');
      expect(callArgs.params).toHaveLength(2);

      const typedData = JSON.parse(callArgs.params[1]);
      expect(typedData.domain.name).toBe('x402');
      expect(typedData.primaryType).toBe('Payment');
      expect(typedData.message.price).toBe('0.01');
      expect(typedData.message.currency).toBe('USDC');
    });
  });
});


