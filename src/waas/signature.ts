/**
 * Easy signature generation functions for payment challenges
 */

import type { PaymentChallenge, PaymentSignature } from "../types";
import type { WAASProvider } from "./base";
import { getConfig } from "../core";

/**
 * Easy function to sign a payment challenge with WAAS provider
 * 
 * This is a convenience wrapper that makes it easy to sign challenges
 * with a WAAS provider, either provided directly or from global config.
 * 
 * @param challenge - Payment challenge to sign
 * @param waasProvider - Optional WAAS provider (overrides global config)
 * @returns PaymentSignature with signature, or null if signing fails
 * 
 * @example
 * ```ts
 * import { signPaymentWithWAAS } from 'x402instant/waas';
 * 
 * // With a specific provider
 * const signature = await signPaymentWithWAAS(challenge, privyProvider);
 * 
 * // Or use globally configured provider
 * const signature = await signPaymentWithWAAS(challenge);
 * ```
 */
export async function signPaymentWithWAAS(
  challenge: PaymentChallenge,
  waasProvider?: WAASProvider
): Promise<PaymentSignature | null> {
  if (waasProvider) {
    return await waasProvider.signPayment(challenge);
  }
  
  // Try to get from global config
  const config = getConfig();
  if (config.mode === "embedded" && config.waasProvider) {
    return await config.waasProvider.signPayment(challenge);
  }
  
  throw new Error("No WAAS provider available. Please provide a waasProvider or configure one in initX402.");
}

