# x402instant

TypeScript frontend SDK for [x402](https://x402.io) HTTP-native payments using stablecoins.

## Related Packages

- **[fastx402](https://github.com/cybertheory/fastx402)** - Python/FastAPI backend integration
- **[fastx402-ts](https://github.com/cybertheory/fastx402-ts)** - TypeScript/Express backend integration

Use x402instant in your frontend to connect wallets and sign payments, then connect to backends built with fastx402 or fastx402-ts.

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

## Backend Integration

x402instant works seamlessly with backend servers built with:

### Python Backend (FastAPI)

```python
# Backend using fastx402
from fastapi import FastAPI
from fastx402 import payment_required

app = FastAPI()

@app.get("/paid")
@payment_required(price="0.01", currency="USDC", chain_id="8453")
def paid_route():
    return {"msg": "you paid!"}
```

See **[fastx402](https://github.com/cybertheory/fastx402)** for Python backend setup.

### TypeScript Backend (Express)

```typescript
// Backend using fastx402-ts
import { paymentRequired } from "fastx402";

app.get("/paid", paymentRequired({
  price: "0.01",
  currency: "USDC",
  chainId: 8453
}), (req, res) => {
  res.json({ msg: "you paid!" });
});
```

See **[fastx402-ts](https://github.com/cybertheory/fastx402-ts)** for TypeScript backend setup.

### Frontend Usage

```typescript
// Frontend using x402instant
import { x402Fetch } from "x402instant";

// Automatically handles 402 challenges, wallet connection, and signing
const response = await x402Fetch("http://api.example.com/paid");
const data = await response.json();
```

## Example

See the `example/` directory for a complete Vite + TypeScript example.

## License

MIT

# x402Instant
