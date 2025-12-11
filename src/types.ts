/**
 * Type definitions for x402instant
 */

export interface PaymentChallenge {
  price: string;
  currency: string;
  chain_id: number;
  merchant: string;
  timestamp: number;
  description?: string;
  nonce?: string;
}

export interface PaymentSignature {
  signature: string;
  signer: string;
  challenge: PaymentChallenge;
  messageHash?: string;
}

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  provider: any; // EIP-1193 provider
}

export interface X402Config {
  defaultChain?: number;
  preferredToken?: string;
  autoConnect?: boolean;
  onWalletConnected?: (address: string) => void;
  onPaymentComplete?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any; // EIP-1193 provider
}

