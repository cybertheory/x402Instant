/**
 * Wallet detection using EIP-6963 and EIP-1193
 */

import type { WalletInfo, EIP6963ProviderDetail } from "./types";

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Detect wallets using EIP-6963
 */
export async function detectWallets(): Promise<WalletInfo[]> {
  const wallets: WalletInfo[] = [];

  // Listen for EIP-6963 announcements
  if (typeof window !== "undefined") {
    window.addEventListener("eip6963:announceProvider", ((event: CustomEvent) => {
      const detail = event.detail as EIP6963ProviderDetail;
      wallets.push({
        id: detail.info.uuid,
        name: detail.info.name,
        icon: detail.info.icon,
        provider: detail.provider,
      });
    }) as EventListener);

    // Request provider announcements
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  // Also check for window.ethereum (legacy)
  if (window.ethereum) {
    const isMetaMask = window.ethereum.isMetaMask;
    const isCoinbaseWallet = window.ethereum.isCoinbaseWallet;

    wallets.push({
      id: "window.ethereum",
      name: isMetaMask
        ? "MetaMask"
        : isCoinbaseWallet
        ? "Coinbase Wallet"
        : "Injected Wallet",
      icon: "",
      provider: window.ethereum,
    });
  }

  // Wait a bit for EIP-6963 announcements
  await new Promise((resolve) => setTimeout(resolve, 100));

  return wallets;
}

/**
 * Get the first available wallet
 */
export async function getDefaultWallet(): Promise<WalletInfo | null> {
  const wallets = await detectWallets();
  return wallets.length > 0 ? wallets[0] : null;
}

/**
 * Connect to a wallet
 */
export async function connectWallet(
  wallet: WalletInfo
): Promise<string | null> {
  try {
    const accounts = await wallet.provider.request({
      method: "eth_requestAccounts",
    });
    return accounts[0] || null;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    return null;
  }
}

/**
 * Switch network if needed
 */
export async function switchNetwork(
  provider: any,
  chainId: number
): Promise<boolean> {
  try {
    const currentChainId = await provider.request({
      method: "eth_chainId",
    });

    const currentChainIdNum = parseInt(currentChainId, 16);

    if (currentChainIdNum !== chainId) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // Chain not added, try to add it
        if (switchError.code === 4902) {
          // You would need to provide chain details here
          // For now, just return false
          return false;
        }
        throw switchError;
      }
    }

    return true;
  } catch (error) {
    console.error("Failed to switch network:", error);
    return false;
  }
}


