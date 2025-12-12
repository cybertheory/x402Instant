/**
 * Privy WAAS provider implementation for client-side
 * 
 * Uses @privy/react SDK for embedded wallet signing
 */

import type { PaymentChallenge, PaymentSignature } from "../types";
import type { WAASProvider } from "./base";
import { getEIP712Domain, getEIP712Types, createPaymentMessage } from "../signer";

interface PrivyConfig {
  // Privy hooks from @privy/react
  // Either provide usePrivy and useWallets hooks, or provide the wallet directly
  usePrivy?: () => any;
  useWallets?: () => any;
  // Or provide wallet client directly (for non-React usage)
  walletClient?: any;
  // Or provide Privy client instance
  privyClient?: any;
}

/**
 * Privy wallet-as-a-service provider for client-side
 * 
 * Supports multiple Privy SDK usage patterns:
 * 1. React hooks (usePrivy, useWallets)
 * 2. Direct wallet client
 * 3. Privy client instance
 * 
 * Example with React:
 * ```tsx
 * import { usePrivy, useWallets } from '@privy/react';
 * import { PrivyWAASProvider } from 'x402instant';
 * 
 * function MyComponent() {
 *   const { ready } = usePrivy();
 *   const { wallets } = useWallets();
 *   
 *   const waas = new PrivyWAASProvider({
 *     usePrivy: () => usePrivy(),
 *     useWallets: () => useWallets()
 *   });
 * }
 * ```
 * 
 * Example with direct wallet:
 * ```ts
 * import { PrivyWAASProvider } from 'x402instant';
 * 
 * const waas = new PrivyWAASProvider({
 *   walletClient: embeddedWallet // from Privy SDK
 * });
 * ```
 */
export class PrivyWAASProvider implements WAASProvider {
  private usePrivyHook?: () => any;
  private useWalletsHook?: () => any;
  private walletClient?: any;
  private privyClient?: any;

  constructor(config: PrivyConfig) {
    this.usePrivyHook = config.usePrivy;
    this.useWalletsHook = config.useWallets;
    this.walletClient = config.walletClient;
    this.privyClient = config.privyClient;
    
    if (!this.usePrivyHook && !this.useWalletsHook && !this.walletClient && !this.privyClient) {
      console.warn("Privy provider not properly configured. Please provide usePrivy/useWallets hooks, walletClient, or privyClient.");
    }
  }

  private async getEmbeddedWallet(): Promise<any> {
    // If wallet client is provided directly, use it
    if (this.walletClient) {
      return this.walletClient;
    }

    // If Privy client is provided, get wallet from it
    if (this.privyClient) {
      try {
        const user = await this.privyClient.getUser();
        if (user) {
          // Try to get embedded wallet from user
          const embeddedWallet = user.getEmbeddedWallet?.();
          if (embeddedWallet) {
            return embeddedWallet;
          }
          // Fallback: try wallet property
          if (user.wallet) {
            return user.wallet;
          }
        }
      } catch (error) {
        console.error("Failed to get wallet from Privy client:", error);
      }
    }

    // If hooks are provided, use them (React context)
    if (this.useWalletsHook) {
      try {
        const { wallets } = this.useWalletsHook();
        // Find embedded wallet
        const embeddedWallet = wallets.find(
          (w: any) => w.walletClientType === 'privy' || w.connectorType === 'embedded'
        );
        if (embeddedWallet) {
          return embeddedWallet;
        }
        // Fallback to first wallet
        if (wallets.length > 0) {
          return wallets[0];
        }
      } catch (error) {
        console.error("Failed to get wallet from hooks:", error);
      }
    }

    return null;
  }

  async signPayment(challenge: PaymentChallenge): Promise<PaymentSignature | null> {
    try {
      const wallet = await this.getEmbeddedWallet();
      if (!wallet) {
        throw new Error("No Privy wallet available");
      }

      // Prepare EIP-712 structured data
      const domain = getEIP712Domain(challenge.chain_id);
      const types = getEIP712Types();
      const message = createPaymentMessage(challenge);

      // Get wallet address
      let address: string;
      if (wallet.address) {
        address = wallet.address;
      } else if (wallet.getAddress) {
        address = await wallet.getAddress();
      } else if (wallet.account?.address) {
        address = wallet.account.address;
      } else {
        throw new Error("Could not get wallet address from Privy wallet");
      }

      // Sign using Privy's signing method
      // Privy embedded wallets support signTypedData
      let signature: string;
      
      if (wallet.signTypedData) {
        // Direct signTypedData method
        signature = await wallet.signTypedData({
          domain,
          types,
          primaryType: "Payment",
          message,
        });
      } else if (wallet.signMessage) {
        // Fallback: encode and sign message hash
        // This is less ideal but works if signTypedData isn't available
        const { ethers } = await import("ethers");
        const messageHash = ethers.TypedDataEncoder.hash(domain, types, message);
        signature = await wallet.signMessage(ethers.getBytes(messageHash));
      } else if (wallet.sendTransaction) {
        // Last resort: try to use sendTransaction (not recommended for signing)
        throw new Error("Privy wallet does not support signTypedData. Please use a wallet that supports EIP-712 signing.");
      } else {
        throw new Error("Privy wallet does not have a compatible signing method");
      }

      return {
        signature,
        signer: address,
        challenge,
      };
    } catch (error: any) {
      console.error("Failed to sign payment with Privy:", error);
      return null;
    }
  }

  async getWalletAddress(): Promise<string | null> {
    try {
      const wallet = await this.getEmbeddedWallet();
      if (!wallet) {
        return null;
      }

      if (wallet.address) {
        return wallet.address;
      } else if (wallet.getAddress) {
        return await wallet.getAddress();
      } else if (wallet.account?.address) {
        return wallet.account.address;
      }

      return null;
    } catch (error) {
      console.error("Failed to get Privy wallet address:", error);
      return null;
    }
  }

  async isReady(): Promise<boolean> {
    try {
      // Check if hooks are available and ready
      if (this.usePrivyHook) {
        const { ready, authenticated } = this.usePrivyHook();
        if (!ready || !authenticated) {
          return false;
        }
      }

      const wallet = await this.getEmbeddedWallet();
      return wallet !== null;
    } catch {
      return false;
    }
  }
}

