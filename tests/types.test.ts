/**
 * Tests for types.ts - Type checking and validation
 */

import { describe, it, expect } from 'vitest';
import type {
  PaymentChallenge,
  PaymentSignature,
  WalletInfo,
  X402Config,
  EIP6963ProviderInfo,
  EIP6963ProviderDetail,
} from '../src/types';

describe('types', () => {
  describe('PaymentChallenge', () => {
    it('should have required fields', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      expect(challenge.price).toBe('0.01');
      expect(challenge.currency).toBe('USDC');
      expect(challenge.chain_id).toBe(8453);
      expect(challenge.merchant).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0');
      expect(challenge.timestamp).toBe(1699123456);
    });

    it('should support optional fields', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
        description: 'Test payment',
        nonce: 'test-nonce',
      };

      expect(challenge.description).toBe('Test payment');
      expect(challenge.nonce).toBe('test-nonce');
    });
  });

  describe('PaymentSignature', () => {
    it('should have required fields', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const signature: PaymentSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
      };

      expect(signature.signature).toBe('0x1234');
      expect(signature.signer).toBe('0x5678');
      expect(signature.challenge).toEqual(challenge);
    });

    it('should support optional messageHash', () => {
      const challenge: PaymentChallenge = {
        price: '0.01',
        currency: 'USDC',
        chain_id: 8453,
        merchant: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
        timestamp: 1699123456,
      };

      const signature: PaymentSignature = {
        signature: '0x1234',
        signer: '0x5678',
        challenge,
        messageHash: '0xabcd',
      };

      expect(signature.messageHash).toBe('0xabcd');
    });
  });

  describe('WalletInfo', () => {
    it('should have required fields', () => {
      const wallet: WalletInfo = {
        id: 'test-wallet',
        name: 'Test Wallet',
        icon: 'data:image/png;base64,test',
        provider: {},
      };

      expect(wallet.id).toBe('test-wallet');
      expect(wallet.name).toBe('Test Wallet');
      expect(wallet.icon).toBe('data:image/png;base64,test');
      expect(wallet.provider).toBeDefined();
    });
  });

  describe('X402Config', () => {
    it('should support all optional fields', () => {
      const config: X402Config = {
        defaultChain: 8453,
        preferredToken: 'USDC',
        autoConnect: true,
        onWalletConnected: (address) => {
          expect(address).toBeDefined();
        },
        onPaymentComplete: (txHash) => {
          expect(txHash).toBeDefined();
        },
        onError: (error) => {
          expect(error).toBeInstanceOf(Error);
        },
      };

      expect(config.defaultChain).toBe(8453);
      expect(config.preferredToken).toBe('USDC');
      expect(config.autoConnect).toBe(true);
      expect(config.onWalletConnected).toBeDefined();
      expect(config.onPaymentComplete).toBeDefined();
      expect(config.onError).toBeDefined();
    });

    it('should work with empty config', () => {
      const config: X402Config = {};
      expect(config).toEqual({});
    });
  });

  describe('EIP6963ProviderInfo', () => {
    it('should have required fields', () => {
      const info: EIP6963ProviderInfo = {
        uuid: 'test-uuid',
        name: 'Test Wallet',
        icon: 'data:image/png;base64,test',
        rdns: 'com.test.wallet',
      };

      expect(info.uuid).toBe('test-uuid');
      expect(info.name).toBe('Test Wallet');
      expect(info.icon).toBe('data:image/png;base64,test');
      expect(info.rdns).toBe('com.test.wallet');
    });
  });

  describe('EIP6963ProviderDetail', () => {
    it('should have required fields', () => {
      const detail: EIP6963ProviderDetail = {
        info: {
          uuid: 'test-uuid',
          name: 'Test Wallet',
          icon: 'data:image/png;base64,test',
          rdns: 'com.test.wallet',
        },
        provider: {},
      };

      expect(detail.info).toBeDefined();
      expect(detail.provider).toBeDefined();
    });
  });
});


