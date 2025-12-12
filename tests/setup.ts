/**
 * Test setup file for vitest
 */

import { vi } from 'vitest';

// Mock window.ethereum
Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: undefined,
  configurable: true,
});

// Mock fetch globally
global.fetch = vi.fn();

// Note: window.addEventListener and window.dispatchEvent are not mocked globally
// to allow tests to use real event listeners when needed

