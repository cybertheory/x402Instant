import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'example/',
        'tests/',
        '**/*.d.ts',
      ],
    },
  },
  // Ignore PostCSS config issues from parent directories
  css: {
    postcss: false,
  },
});

