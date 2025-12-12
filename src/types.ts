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

import type { WAASProvider } from "./waas";

export interface X402Config {
  defaultChain?: number;
  preferredToken?: string;
  autoConnect?: boolean;
  mode?: "instant" | "embedded"; // Payment mode
  waasProvider?: WAASProvider; // WAAS provider for embedded mode
  // WebSocket backend connection (for backend Python client communication)
  wsBackendUrl?: string; // WebSocket URL for backend server (e.g., "ws://localhost:4021/x402/ws")
  wsAutoConnect?: boolean; // Automatically connect to backend WebSocket server (default: true if wsBackendUrl provided)
  wsReconnect?: boolean; // Auto-reconnect on disconnect (default: true)
  wsMaxReconnectAttempts?: number; // Max reconnect attempts (default: Infinity for durable connection)
  onWalletConnected?: (address: string) => void;
  onPaymentComplete?: (txHash: string) => void;
  onError?: (error: Error) => void;
  onWsConnected?: () => void; // Called when WebSocket connects to backend
  onWsDisconnected?: () => void; // Called when WebSocket disconnects
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

