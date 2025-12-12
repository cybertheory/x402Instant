/**
 * WebSocket client for x402instant
 * 
 * Connects to fastx402 backend WebSocket server for payment signing in instant mode.
 * 
 * Usage:
 * ```ts
 * import { connectWebSocketClient } from 'x402instant/ws-client';
 * 
 * // Connect to backend WebSocket server
 * const client = await connectWebSocketClient('ws://localhost:4021/x402/ws');
 * 
 * // Client automatically handles signing requests from backend
 * ```
 */

import type { PaymentChallenge, PaymentSignature } from "./types";
import { signPaymentChallenge } from "./core";

export interface WebSocketClientOptions {
  url: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface WebSocketMessage {
  type: "sign-request" | "sign-response" | "error" | "ping" | "pong" | "connected";
  id?: string;
  challenge?: PaymentChallenge;
  result?: PaymentSignature | null;
  error?: string;
  clientId?: string;
  message?: string;
}

/**
 * Connect to fastx402 backend WebSocket server
 * 
 * This client connects to the backend's WebSocket server and automatically
 * handles payment signing requests using the user's wallet (instant mode).
 * 
 * @param options - Client configuration options
 * @returns WebSocket client instance
 */
export async function connectWebSocketClient(
  options: WebSocketClientOptions | string
): Promise<WebSocketClient> {
  const opts: WebSocketClientOptions = typeof options === "string"
    ? { url: options }
    : options;

  const client = new WebSocketClient(opts);
  await client.connect();
  return client;
}

/**
 * WebSocket client for x402instant
 */
export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private options: WebSocketClientOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isConnected = false;

  constructor(options: WebSocketClientOptions) {
    this.url = options.url;
    this.options = {
      reconnect: true,
      maxReconnectAttempts: Infinity, // Default to infinite for durable connections
      reconnectDelay: 2000,
      ...options,
    };
  }

  async connect(): Promise<void> {
    if (this.isConnecting || this.isConnected) {
      return;
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.isConnecting = false;
          this.isConnected = true;
          this.reconnectAttempts = 0;

          if (this.options.onConnect) {
            this.options.onConnect();
          }

          resolve();
        };

        this.ws.onmessage = async (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            await this.handleMessage(message);
          } catch (error: any) {
            console.error("Failed to parse WebSocket message:", error);
            if (this.options.onError) {
              this.options.onError(error);
            }
          }
        };

        this.ws.onerror = (error) => {
          this.isConnecting = false;
          if (this.options.onError) {
            this.options.onError(new Error("WebSocket connection error"));
          }
          reject(error);
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.isConnecting = false;

          if (this.options.onDisconnect) {
            this.options.onDisconnect();
          }

          // Attempt to reconnect if enabled
          const maxAttempts = this.options.maxReconnectAttempts ?? Infinity;
          if (this.options.reconnect && (maxAttempts === Infinity || this.reconnectAttempts < maxAttempts)) {
            this.reconnectAttempts++;
            // Use exponential backoff, but cap at 30 seconds for durable connections
            const baseDelay = this.options.reconnectDelay || 2000;
            const delay = Math.min(
              baseDelay * Math.pow(2, Math.min(this.reconnectAttempts - 1, 4)), // Cap exponential growth
              30000 // Max 30 seconds between attempts
            );
            
            this.reconnectTimer = setTimeout(() => {
              this.connect().catch(() => {
                // Reconnection failed, will retry on next attempt
              });
            }, delay);
          }
        };
      } catch (error: any) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private async handleMessage(message: WebSocketMessage): Promise<void> {
    switch (message.type) {
      case "sign-request":
        if (!message.id || !message.challenge) {
          this.send({
            type: "error",
            id: message.id,
            error: "Invalid sign-request: missing id or challenge",
          });
          return;
        }

        // Sign the payment challenge using instant mode (user's wallet)
        try {
          const signature = await signPaymentChallenge(message.challenge);

          this.send({
            type: "sign-response",
            id: message.id,
            result: signature,
          });
        } catch (error: any) {
          this.send({
            type: "sign-response",
            id: message.id,
            result: null,
            error: error.message || "Failed to sign payment",
          });
        }
        break;

      case "ping":
        this.send({ type: "pong" });
        break;

      case "connected":
        console.log("Connected to x402 WebSocket server:", message.message);
        break;

      case "error":
        console.error("WebSocket server error:", message.error);
        if (this.options.onError) {
          this.options.onError(new Error(message.error || "Unknown error"));
        }
        break;

      default:
        console.warn("Unknown message type:", message.type);
    }
  }

  private send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message");
    }
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
    this.isConnecting = false;
  }

  isReady(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}

