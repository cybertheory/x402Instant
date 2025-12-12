/**
 * x402instant - TypeScript frontend SDK for x402 payments
 */

export { initX402, x402Fetch, detectWallets, signPaymentChallenge, signPayment, getWebSocketClient, disconnectWebSocket } from "./core";
export type { X402Config, PaymentChallenge, WalletInfo, PaymentSignature } from "./types";
export { useX402, X402Provider } from "./react";
export { connectWebSocketClient, WebSocketClient } from "./ws-client";
export { PrivyWAASProvider } from "./waas";
export type { WAASProvider } from "./waas";
export { signPaymentWithWAAS } from "./waas/signature";
export { resetClient } from "./fetch";

// Expose signPaymentChallenge globally for fastx402-ts integration
// This allows fastx402-ts X402Client to automatically use x402instant
// when both libraries are present in the frontend
if (typeof window !== "undefined") {
  (window as any).x402instant = {
    signPaymentChallenge: async (challenge: any) => {
      const { signPaymentChallenge } = await import("./core");
      return await signPaymentChallenge(challenge);
    },
  };
}

