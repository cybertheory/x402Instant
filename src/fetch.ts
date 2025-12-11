/**
 * x402Fetch - Fetch wrapper that handles 402 payment challenges
 */

import type { PaymentChallenge, PaymentSignature } from "./types";
import { getDefaultWallet, connectWallet, switchNetwork } from "./wallet";
import { signPayment, signPaymentWithProvider } from "./signer";

let currentWallet: any = null;
let currentAddress: string | null = null;

/**
 * Set the current wallet
 */
export function setWallet(wallet: any, address: string | null) {
  currentWallet = wallet;
  currentAddress = address;
}

/**
 * Handle 402 payment challenge
 */
async function handle402Challenge(
  challenge: PaymentChallenge
): Promise<PaymentSignature | null> {
  // Get or connect wallet
  if (!currentWallet) {
    const wallet = await getDefaultWallet();
    if (!wallet) {
      throw new Error("No wallet available");
    }

    const address = await connectWallet(wallet);
    if (!address) {
      throw new Error("Failed to connect wallet");
    }

    currentWallet = wallet.provider;
    currentAddress = address;
  }

  // Switch network if needed
  await switchNetwork(currentWallet, challenge.chain_id);

  // Try signing with ethers first (if available)
  try {
    const { ethers } = await import("ethers");
    if (ethers && ethers.BrowserProvider) {
      const provider = new ethers.BrowserProvider(currentWallet);
      const signed = await signPayment(challenge, provider);
      if (signed) return signed;
    }
  } catch (error) {
    console.warn("Ethers signing failed, trying provider method:", error);
  }

  // Fallback to provider.request
  if (currentAddress) {
    return await signPaymentWithProvider(
      challenge,
      currentWallet,
      currentAddress
    );
  }

  return null;
}

/**
 * Create X-PAYMENT header from signature
 */
function createPaymentHeader(signature: PaymentSignature): string {
  return JSON.stringify({
    signature: signature.signature,
    signer: signature.signer,
    challenge: signature.challenge,
  });
}

/**
 * x402Fetch - Fetch wrapper that handles 402 challenges
 */
export async function x402Fetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Make initial request
  let response = await fetch(url, options);

  // Handle 402 Payment Required
  if (response.status === 402) {
    try {
      const data = await response.json();
      const challenge = data.challenge as PaymentChallenge;

      if (!challenge) {
        throw new Error("Invalid 402 challenge format");
      }

      // Sign payment
      const signature = await handle402Challenge(challenge);

      if (!signature) {
        throw new Error("Failed to sign payment");
      }

      // Retry request with X-PAYMENT header
      const paymentHeader = createPaymentHeader(signature);
      const headers = new Headers(options.headers);
      headers.set("X-PAYMENT", paymentHeader);

      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error("Failed to handle 402 challenge:", error);
      throw error;
    }
  }

  return response;
}

