/**
 * Base interface for Wallet-as-a-Service (WAAS) providers (client-side)
 */

import type { PaymentChallenge, PaymentSignature } from "../types";

/**
 * Base interface for WAAS providers on the client side
 */
export interface WAASProvider {
  /**
   * Sign a payment challenge using the WAAS provider
   */
  signPayment(challenge: PaymentChallenge): Promise<PaymentSignature | null>;
  
  /**
   * Get the wallet address for the current user
   */
  getWalletAddress(): Promise<string | null>;
  
  /**
   * Check if the provider is ready/connected
   */
  isReady(): Promise<boolean>;
}


