# x402instant Example

Example React application demonstrating x402 payment integration.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Build the x402instant library (if not already built):

```bash
cd ..
npm run build
cd example
```

3. Start the development server:

```bash
npm run dev
```

## Usage

1. Open http://localhost:3000
2. Click "Initialize x402" to detect wallets
3. Connect your wallet when prompted
4. Click "Make Paid Request" to test payment flow

## Configuration

Update the API endpoint in `src/App.tsx`:

```typescript
const res = await x402Fetch("http://localhost:8000/paid");
```

Make sure your backend server (fastx402) is running on the configured port.

