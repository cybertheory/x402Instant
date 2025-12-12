/**
 * x402Fetch - Fetch wrapper that handles 402 payment challenges
 * Uses fastx402-ts X402Client under the hood
 * 
 * This integrates fastx402-ts client with x402instant's signPaymentChallenge
 * which handles both instant mode (user's wallet) and embedded mode (WAAS providers)
 */

import type { PaymentChallenge, PaymentSignature } from "./types";
import { signPaymentChallenge } from "./core";
import { X402Client } from "fastx402";
import { getConfig } from "./core";

let clientInstance: X402Client | null = null;

/**
 * Handle 402 payment challenge using x402instant's signPaymentChallenge
 * This automatically handles both instant and embedded modes based on config
 */
async function handle402Challenge(
  challenge: PaymentChallenge
): Promise<PaymentSignature | null> {
  // Use x402instant's signPaymentChallenge which handles both modes
  // - Instant mode: uses user's wallet
  // - Embedded mode: uses configured WAAS provider
  return await signPaymentChallenge(challenge);
}

/**
 * Get or create X402Client instance
 * Automatically uses x402instant's signPaymentChallenge for both modes
 */
function getClient(): X402Client {
  if (!clientInstance) {
    const config = getConfig();
    
    // Create client with rpcHandler that uses x402instant's signPaymentChallenge
    // This ensures both instant and embedded modes work correctly
    clientInstance = new X402Client({
      rpcHandler: handle402Challenge,
      mode: config.mode || "instant", // Pass mode from config
    });
  }
  return clientInstance;
}

/**
 * Reset client instance (useful when config changes)
 */
export function resetClient(): void {
  clientInstance = null;
}

/**
 * Set the current wallet (for backward compatibility)
 * Note: This is handled by x402instant's core signPaymentChallenge now
 */
export function setWallet(wallet: any, address: string | null): void {
  // Wallet is managed by x402instant's core functionality
  // This function is kept for backward compatibility
  // Reset client to pick up any config changes
  resetClient();
}

/**
 * x402Fetch - Fetch wrapper that handles 402 challenges
 * Uses fastx402-ts X402Client under the hood
 * 
 * Automatically integrates with x402instant's signPaymentChallenge
 * which handles both instant mode (user's wallet) and embedded mode (WAAS)
 * 
 * @example
 * ```ts
 * import { initX402, x402Fetch } from 'x402instant';
 * 
 * // Initialize with instant mode (default)
 * await initX402({ mode: 'instant' });
 * 
 * // Or initialize with embedded mode
 * await initX402({ 
 *   mode: 'embedded',
 *   waasProvider: privyProvider 
 * });
 * 
 * // Make requests - automatically handles 402 challenges
 * const response = await x402Fetch('https://api.example.com/paid');
 * ```
 */
export async function x402Fetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const client = getClient();
  return client.request(url, options);
}

