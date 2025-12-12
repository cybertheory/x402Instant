/**
 * Core x402instant functionality
 */

import type { X402Config, WalletInfo, PaymentChallenge, PaymentSignature } from "./types";
import { detectWallets, getDefaultWallet, connectWallet } from "./wallet";
import { signPayment, signPaymentWithProvider } from "./signer";
import { x402Fetch, setWallet } from "./fetch";
import { WebSocketClient } from "./ws-client";

let config: X402Config = {};
let wsClient: WebSocketClient | null = null;

/**
 * Get WebSocket backend client URL from config or environment
 * This is the URL where the backend fastx402 client's WebSocket server is running
 */
function getWebSocketBackendUrl(): string | null {
  // Check config first (highest priority)
  if (config.wsBackendUrl) {
    return config.wsBackendUrl;
  }

  // Check environment variables (for build-time configuration)
  // Support multiple bundler formats
  let envUrl: string | undefined;

  // Node.js / CommonJS
  if (typeof process !== "undefined" && process.env) {
    envUrl = process.env.X402_WS_BACKEND_URL || 
             process.env.VITE_X402_WS_BACKEND_URL ||
             process.env.NEXT_PUBLIC_X402_WS_BACKEND_URL;
  }

  // Vite / import.meta.env
  try {
    // @ts-ignore - import.meta may not be available in all environments
    if (import.meta?.env) {
      // @ts-ignore
      envUrl = envUrl || import.meta.env.VITE_X402_WS_BACKEND_URL;
    }
  } catch {
    // Not in ESM module environment
  }

  // window.env (for runtime configuration)
  if (typeof window !== "undefined") {
    const win = window as any;
    envUrl = envUrl || win.env?.X402_WS_BACKEND_URL;
  }

  if (envUrl) {
    return envUrl;
  }

  // Default: try localhost on default port
  // This allows backend fastx402 client to start WebSocket server without configuration
  // Backend Python client defaults to port 4021
  return "ws://localhost:4021/x402/ws";
}

/**
 * Initialize WebSocket connection to backend
 */
async function initWebSocketConnection(): Promise<void> {
  // Don't initialize if already connected
  if (wsClient && wsClient.isReady()) {
    return;
  }

  const wsUrl = getWebSocketBackendUrl();
  if (!wsUrl) {
    return;
  }

  // Check if auto-connect is enabled (default: true if URL is available)
  const shouldAutoConnect = config.wsAutoConnect !== false;
  if (!shouldAutoConnect) {
    return;
  }

  try {
    const { connectWebSocketClient } = await import("./ws-client");
    
    wsClient = await connectWebSocketClient({
      url: wsUrl,
      reconnect: config.wsReconnect !== false, // Default: true for durable connection
      maxReconnectAttempts: config.wsMaxReconnectAttempts ?? Infinity, // Default: infinite for durable connection
      reconnectDelay: 2000,
      onConnect: () => {
        console.log(`x402instant: Connected to backend WebSocket at ${wsUrl}`);
        config.onWsConnected?.();
      },
      onDisconnect: () => {
        console.log("x402instant: Disconnected from backend WebSocket");
        config.onWsDisconnected?.();
      },
      onError: (error) => {
        console.error("x402instant: WebSocket error:", error);
        config.onError?.(error);
      },
    });
  } catch (error: any) {
    // Backend WebSocket server might not be running yet
    // That's okay - we'll keep trying to reconnect
    console.warn(`x402instant: Failed to connect to backend WebSocket at ${wsUrl}:`, error.message);
    console.warn("x402instant: Will retry automatically when backend server is available");
  }
}

/**
 * Get or create WebSocket client instance
 */
export function getWebSocketClient(): WebSocketClient | null {
  return wsClient;
}

/**
 * Disconnect WebSocket client
 */
export function disconnectWebSocket(): void {
  if (wsClient) {
    wsClient.disconnect();
    wsClient = null;
  }
}

/**
 * Initialize x402instant
 */
export async function initX402(userConfig: X402Config = {}): Promise<void> {
  config = { ...config, ...userConfig };

  // Auto-connect wallet if enabled
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

  // Auto-connect to backend WebSocket server if configured
  // This creates a durable connection in the background
  await initWebSocketConnection();
}

/**
 * Get current configuration
 */
export function getConfig(): X402Config {
  return { ...config };
}

// Re-export functions
export { x402Fetch, detectWallets };
// getWebSocketClient and disconnectWebSocket are already exported above

/**
 * Sign a payment challenge
 */
export async function signPaymentChallenge(
  challenge: PaymentChallenge
): Promise<PaymentSignature | null> {
  const currentConfig = getConfig();
  
  // Embedded mode: use WAAS provider
  if (currentConfig.mode === "embedded" && currentConfig.waasProvider) {
    return await currentConfig.waasProvider.signPayment(challenge);
  }
  
  // Instant mode: use user's wallet
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

