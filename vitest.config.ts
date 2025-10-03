import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true,
    include: ['packages/**/?(*.){test,spec}.{ts,tsx}'],
    coverage: { provider: 'v8', reporter: ['text', 'lcov'], reportsDirectory: './coverage' }
  }
});
