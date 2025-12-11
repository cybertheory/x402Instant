/**
 * EIP-712 payment signing utilities
 */

import { ethers } from "ethers";
import type { PaymentChallenge, PaymentSignature } from "./types";

/**
 * Get EIP-712 domain for x402 payments
 */
export function getEIP712Domain(chainId: number) {
  return {
    name: "x402",
    version: "1",
    chainId: chainId,
    verifyingContract: "0x0000000000000000000000000000000000000000",
  };
}

/**
 * Get EIP-712 types for payment message
 */
export function getEIP712Types() {
  return {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    Payment: [
      { name: "price", type: "string" },
      { name: "currency", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "merchant", type: "address" },
      { name: "timestamp", type: "uint256" },
      { name: "description", type: "string" },
    ],
  };
}

/**
 * Create payment message from challenge
 */
export function createPaymentMessage(challenge: PaymentChallenge) {
  return {
    price: challenge.price,
    currency: challenge.currency,
    chainId: challenge.chain_id,
    merchant: ethers.getAddress(challenge.merchant),
    timestamp: challenge.timestamp,
    description: challenge.description || "",
  };
}

/**
 * Sign payment challenge using EIP-712
 */
export async function signPayment(
  challenge: PaymentChallenge,
  provider: any
): Promise<PaymentSignature | null> {
  try {
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    const domain = getEIP712Domain(challenge.chain_id);
    const types = getEIP712Types();
    const message = createPaymentMessage(challenge);

    // Sign using ethers v6 signTypedData
    const signature = await signer.signTypedData(domain, types, message);

    return {
      signature,
      signer: signerAddress,
      challenge,
    };
  } catch (error) {
    console.error("Failed to sign payment:", error);
    return null;
  }
}

/**
 * Sign payment using provider.request (for wallets that don't support ethers)
 */
export async function signPaymentWithProvider(
  challenge: PaymentChallenge,
  provider: any,
  address: string
): Promise<PaymentSignature | null> {
  try {
    const domain = getEIP712Domain(challenge.chain_id);
    const types = getEIP712Types();
    const message = createPaymentMessage(challenge);

    // Use eth_signTypedData_v4
    const signature = await provider.request({
      method: "eth_signTypedData_v4",
      params: [
        address,
        JSON.stringify({
          domain,
          types,
          primaryType: "Payment",
          message,
        }),
      ],
    });

    return {
      signature,
      signer: address,
      challenge,
    };
  } catch (error) {
    console.error("Failed to sign payment with provider:", error);
    return null;
  }
}

