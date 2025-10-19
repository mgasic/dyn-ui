import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setupTests.ts', './src/test-setup.ts'],
    globals: true,
    css: {
      modules: {
        generateScopedName: 'dyn-[name]__[local]___[hash:base64:5]'
      }
    },
    restoreMocks: true,
    clearMocks: true,
    mockReset: true
  }
});
