/**
 * React hooks and provider for x402instant
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { X402Config, WalletInfo, PaymentChallenge, PaymentSignature } from "./types";
import { initX402, detectWallets, signPaymentChallenge, x402Fetch } from "./core";
import { connectWallet } from "./wallet";

interface X402ContextValue {
  wallet: WalletInfo | null;
  address: string | null;
  wallets: WalletInfo[];
  connect: (wallet: WalletInfo) => Promise<void>;
  signPayment: (challenge: PaymentChallenge) => Promise<PaymentSignature | null>;
  x402Fetch: typeof x402Fetch;
  isConnected: boolean;
}

const X402Context = createContext<X402ContextValue | null>(null);

interface X402ProviderProps {
  children: ReactNode;
  config?: X402Config;
}

/**
 * X402Provider - React context provider
 */
export function X402Provider({ children, config }: X402ProviderProps) {
  const [wallet, setWalletState] = useState<WalletInfo | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  useEffect(() => {
    // Initialize
    initX402(config).then(() => {
      detectWallets().then(setWallets);
    });
  }, [config]);

  const connect = async (wallet: WalletInfo) => {
    const addr = await connectWallet(wallet);
    if (addr) {
      setWalletState(wallet);
      setAddress(addr);
      config?.onWalletConnected?.(addr);
    }
  };

  const signPayment = async (challenge: PaymentChallenge) => {
    if (!wallet) {
      throw new Error("No wallet connected");
    }
    return await signPaymentChallenge(challenge);
  };

  const value: X402ContextValue = {
    wallet,
    address,
    wallets,
    connect,
    signPayment,
    x402Fetch,
    isConnected: !!address,
  };

  return <X402Context.Provider value={value}>{children}</X402Context.Provider>;
}

/**
 * useX402 - React hook for x402 functionality
 */
export function useX402(): X402ContextValue {
  const context = useContext(X402Context);
  if (!context) {
    throw new Error("useX402 must be used within X402Provider");
  }
  return context;
}

