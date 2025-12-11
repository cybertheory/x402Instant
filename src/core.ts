/**
 * Core x402instant functionality
 */

import type { X402Config, WalletInfo, PaymentChallenge, PaymentSignature } from "./types";
import { detectWallets, getDefaultWallet, connectWallet } from "./wallet";
import { signPayment, signPaymentWithProvider } from "./signer";
import { x402Fetch, setWallet } from "./fetch";

let config: X402Config = {};

/**
 * Initialize x402instant
 */
export async function initX402(userConfig: X402Config = {}): Promise<void> {
  config = { ...config, ...userConfig };

  if (config.autoConnect) {
    const wallet = await getDefaultWallet();
    if (wallet) {
      const address = await connectWallet(wallet);
      if (address) {
        setWallet(wallet.provider, address);
        config.onWalletConnected?.(address);
      }
    }
  }
}

/**
 * Get current configuration
 */
export function getConfig(): X402Config {
  return { ...config };
}

// Re-export functions
export { x402Fetch, detectWallets };

/**
 * Sign a payment challenge
 */
export async function signPaymentChallenge(
  challenge: PaymentChallenge
): Promise<PaymentSignature | null> {
  const wallet = await getDefaultWallet();
  if (!wallet) {
    throw new Error("No wallet available");
  }

  const address = await connectWallet(wallet);
  if (!address) {
    throw new Error("Failed to connect wallet");
  }

  setWallet(wallet.provider, address);

  // Try ethers first (if available)
  try {
    const { ethers } = await import("ethers");
    if (ethers && ethers.BrowserProvider) {
      const provider = new ethers.BrowserProvider(wallet.provider);
      const signed = await signPayment(challenge, provider);
      if (signed) return signed;
    }
  } catch (error) {
    console.warn("Ethers signing failed, trying provider method:", error);
  }

  // Fallback to provider.request
  return await signPaymentWithProvider(challenge, wallet.provider, address);
}

// Re-export signPayment from signer for convenience
export { signPayment } from "./signer";

