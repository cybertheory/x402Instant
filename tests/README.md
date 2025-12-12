# x402instant Tests

This directory contains comprehensive tests for the x402instant library.

## Test Structure

- `core.test.ts` - Tests for core initialization and configuration
- `fetch.test.ts` - Tests for x402Fetch and 402 payment challenge handling
- `wallet.test.ts` - Tests for wallet detection and connection
- `signer.test.ts` - Tests for EIP-712 payment signing
- `react.test.tsx` - Tests for React hooks and provider
- `types.test.ts` - Type validation tests
- `setup.ts` - Test setup and global mocks

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run a specific test file
npm test -- tests/core.test.ts
```

## Test Coverage

The test suite covers:

- ✅ Core initialization and configuration
- ✅ Wallet detection (EIP-6963 and legacy window.ethereum)
- ✅ Wallet connection and network switching
- ✅ 402 payment challenge handling
- ✅ EIP-712 payment signing
- ✅ React hooks and context provider
- ✅ Type definitions and validation
- ✅ Error handling and edge cases

## Mocking

Tests use Vitest's mocking capabilities to:

- Mock `window.ethereum` and wallet providers
- Mock `fetch` API for HTTP requests
- Mock EIP-6963 events
- Mock ethers.js for signing operations
- Mock React components and hooks

## Notes

- Tests run in a jsdom environment to simulate browser APIs
- Some tests require async/await patterns due to wallet detection delays
- EIP-6963 event testing requires careful timing to capture event handlers


