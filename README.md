# x402instant

TypeScript frontend SDK for [x402](https://x402.io) HTTP-native payments using stablecoins.

## Installation

```bash
npm install x402instant
# or
yarn add x402instant
# or
pnpm add x402instant
```

## Quick Start

### 1. Initialize

```typescript
import { initX402, x402Fetch } from "x402instant";

await initX402({
  autoConnect: true,
  defaultChain: 8453,
  preferredToken: "USDC"
});
```

### 2. Make Paid Requests

```typescript
const response = await x402Fetch("/api/paid-endpoint");
const data = await response.json();
```

## Features

- 🔍 **EIP-6963 Wallet Detection** - Automatically detects injected wallets
- ✍️ **EIP-712 Signing** - Secure payment signature generation
- 🔄 **Automatic Retry** - Handles 402 challenges and retries with payment
- 🌐 **Multi-Wallet Support** - Works with MetaMask, Coinbase Wallet, Instant Pay, etc.
- ⚛️ **React Hooks** - Optional React integration

## Configuration

```typescript
initX402({
  defaultChain: 8453,              // Default chain ID
  preferredToken: "USDC",         // Preferred token
  autoConnect: true,               // Auto-connect to wallet
  onWalletConnected: (addr) => {   // Wallet connection callback
    console.log("Connected:", addr);
  },
  onPaymentComplete: (txHash) => { // Payment completion callback
    console.log("Payment:", txHash);
  }
});
```

## API

### `initX402(config)`

Initialize the x402 SDK.

### `x402Fetch(url, options?)`

Fetch wrapper that handles 402 challenges automatically.

### `detectWallets()`

Detect available wallets using EIP-6963.

### `signPayment(challenge)`

Sign a payment challenge using EIP-712.

## React Hooks

```typescript
import { useX402, X402Provider } from "x402instant/react";

function App() {
  return (
    <X402Provider>
      <YourComponent />
    </X402Provider>
  );
}

function YourComponent() {
  const { wallet, signPayment, x402Fetch } = useX402();
  
  // Use wallet and payment functions
}
```

## Example

See the `example/` directory for a complete Vite + TypeScript example.

## License

MIT

# x402Instant
