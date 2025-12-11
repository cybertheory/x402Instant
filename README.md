# x402instant

TypeScript frontend SDK for [x402](https://x402.io) HTTP-native payments using stablecoins. This library provides seamless wallet integration, EIP-712 payment signing, and automatic 402 challenge handling for browser-based applications.

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

That's it! The library automatically handles:
- Wallet detection and connection
- 402 challenge detection
- Payment signing with EIP-712
- Request retry with payment headers

## Core Architecture

### Wallet Detection

**EIP-6963 Support**:
- Automatically detects injected wallets using EIP-6963 standard
- Listens for wallet provider announcements
- Supports multiple wallet providers simultaneously
- Fallback to legacy `window.ethereum` for compatibility

**Wallet Connection**:
- Connects to wallets using EIP-1193 standard
- Handles connection requests and account access
- Manages wallet state and address tracking
- Network switching support

### Payment Signing

**EIP-712 Structured Data Signing**:
- Creates EIP-712 domain and type definitions
- Formats payment challenges as structured data
- Signs using wallet's `eth_signTypedData_v4` method
- Supports both ethers.js and direct provider signing

**Signature Generation**:
- Uses EIP-712 domain separator for security
- Includes all payment challenge fields
- Generates verifiable signatures for backend verification
- Handles signing errors gracefully

### Fetch Integration

**Automatic 402 Handling**:
- Wraps native `fetch` API
- Detects HTTP 402 Payment Required responses
- Extracts payment challenges from response JSON
- Triggers payment signing flow automatically
- Retries requests with `X-PAYMENT` headers

**Request Flow**:
1. Make initial request to protected endpoint
2. Receive 402 response with challenge
3. Display challenge to user (optional)
4. Sign challenge with connected wallet
5. Retry request with payment signature
6. Return successful response

## Features

### 🔍 EIP-6963 Wallet Detection

Automatically detects injected wallets using the EIP-6963 standard:
- MetaMask
- Coinbase Wallet
- WalletConnect
- Instant Pay
- Any EIP-6963 compatible wallet

### ✍️ EIP-712 Signing

Secure payment signature generation using EIP-712 structured data:
- Domain separator for chain-specific signing
- Type-safe message encoding
- Wallet-native signing experience
- Cryptographic verification on backend

### 🔄 Automatic Retry

Handles 402 challenges and retries with payment automatically:
- No manual challenge handling required
- Seamless user experience
- Error handling and recovery
- Request/response interception

### 🌐 Multi-Wallet Support

Works with any EIP-1193 compatible wallet:
- MetaMask
- Coinbase Wallet
- WalletConnect
- Browser extension wallets
- Mobile wallet apps

### ⚛️ React Hooks (Optional)

Optional React integration for component-based applications:
- `useX402` hook for wallet state
- `X402Provider` context provider
- React-friendly API

### 🔒 Security Features

- EIP-712 structured data signing prevents signature replay
- Nonce-based challenge validation
- Address checksum validation
- Secure wallet communication

## Configuration

```typescript
import { initX402 } from "x402instant";

await initX402({
  defaultChain: 8453,              // Default chain ID (Base)
  preferredToken: "USDC",         // Preferred token symbol
  autoConnect: true,               // Auto-connect to wallet on init
  onWalletConnected: (addr) => {   // Wallet connection callback
    console.log("Connected:", addr);
  },
  onPaymentComplete: (txHash) => { // Payment completion callback
    console.log("Payment:", txHash);
  },
  onError: (error) => {           // Error handler
    console.error("x402 error:", error);
  }
});
```

### Configuration Options

- **`defaultChain`**: Default Ethereum chain ID (e.g., 8453 for Base)
- **`preferredToken`**: Preferred token symbol for payments (e.g., "USDC")
- **`autoConnect`**: Automatically connect to wallet on initialization
- **`onWalletConnected`**: Callback when wallet connects
- **`onPaymentComplete`**: Callback when payment completes
- **`onError`**: Error handler callback

## API Reference

### Core Functions

#### `initX402(config?)`

Initialize the x402 SDK with optional configuration.

```typescript
await initX402({
  autoConnect: true,
  defaultChain: 8453
});
```

#### `x402Fetch(url, options?)`

Fetch wrapper that handles 402 challenges automatically. Works exactly like native `fetch`, but automatically handles payment challenges.

```typescript
const response = await x402Fetch("https://api.example.com/paid-endpoint");
const data = await response.json();
```

#### `detectWallets()`

Detect available wallets using EIP-6963 and legacy methods.

```typescript
const wallets = await detectWallets();
console.log("Available wallets:", wallets);
// [{ id: "...", name: "MetaMask", icon: "...", provider: {...} }]
```

#### `signPaymentChallenge(challenge)`

Sign a payment challenge using EIP-712. Automatically uses the connected wallet.

```typescript
const signature = await signPaymentChallenge(challenge);
// Returns: { signature: "...", signer: "0x...", challenge: {...} }
```

### React Hooks

#### `useX402()`

React hook for accessing x402 functionality in components.

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
  const handlePayment = async () => {
    const response = await x402Fetch("/api/paid");
    return response.json();
  };
}
```

#### `X402Provider`

React context provider for x402 functionality.

## Usage Examples

### Basic Usage

```typescript
import { initX402, x402Fetch } from "x402instant";

// Initialize
await initX402({ autoConnect: true });

// Make paid request
const response = await x402Fetch("https://api.example.com/paid");
const data = await response.json();
```

### Manual Wallet Connection

```typescript
import { detectWallets, connectWallet, x402Fetch } from "x402instant";

// Detect wallets
const wallets = await detectWallets();

// Connect to first wallet
if (wallets.length > 0) {
  const address = await connectWallet(wallets[0]);
  console.log("Connected:", address);
}

// Make paid request
const response = await x402Fetch("https://api.example.com/paid");
```

### Custom Payment Flow

```typescript
import { signPaymentChallenge, x402Fetch } from "x402instant";

// Make request
let response = await x402Fetch("https://api.example.com/paid");

// If 402, handle manually
if (response.status === 402) {
  const data = await response.json();
  const challenge = data.challenge;
  
  // Sign challenge
  const signature = await signPaymentChallenge(challenge);
  
  // Retry with payment
  response = await x402Fetch("https://api.example.com/paid", {
    headers: {
      "X-PAYMENT": JSON.stringify(signature)
    }
  });
}
```

### React Integration

```typescript
import { useX402, X402Provider } from "x402instant/react";

function App() {
  return (
    <X402Provider>
      <PaymentButton />
    </X402Provider>
  );
}

function PaymentButton() {
  const { wallet, x402Fetch, isConnected } = useX402();
  
  const handleClick = async () => {
    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }
    
    try {
      const response = await x402Fetch("/api/paid");
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };
  
  return (
    <button onClick={handleClick} disabled={!isConnected}>
      {isConnected ? "Make Paid Request" : "Connect Wallet First"}
    </button>
  );
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

## Payment Flow

The complete payment flow:

1. **User Action**: User triggers action requiring payment
2. **Request**: Frontend makes request to protected endpoint
3. **402 Response**: Backend responds with HTTP 402 and challenge
4. **Challenge Display**: Frontend displays payment details (optional)
5. **Wallet Signing**: User signs challenge with wallet (EIP-712)
6. **Retry**: Frontend retries request with `X-PAYMENT` header
7. **Verification**: Backend verifies signature
8. **Success**: Backend returns protected content

## Type System

TypeScript interfaces for type safety:

- **`PaymentChallenge`**: Payment challenge structure
- **`PaymentSignature`**: Signed payment payload
- **`WalletInfo`**: Wallet information and provider
- **`X402Config`**: Configuration options
- **`EIP6963ProviderInfo`**: EIP-6963 provider information

## Dependencies

- `ethers` - Ethereum library for signing and verification
- React (optional) - For React hooks integration

## Browser Support

- Modern browsers with EIP-1193 wallet support
- Chrome, Firefox, Safari, Edge
- Mobile browsers with wallet apps
- Requires wallet extension or mobile wallet app

## Example

See the `example/` directory for a complete React + Vite example demonstrating:
- Wallet detection and connection
- Payment challenge handling
- Automatic request retry
- React hooks integration

## Security Considerations

- Never expose private keys in client-side code
- Always use EIP-712 structured data signing
- Validate payment challenges before signing
- Verify signatures on the backend
- Use HTTPS for all API communications

## License

MIT
