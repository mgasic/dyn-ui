import { defineConfig } from 'vitest/config';

export default defineConfig({
  css: {
    modules: {
      generateScopedName:
        process.env.NODE_ENV === 'production'
          ? 'dyn-[hash:base64:5]'
          : '[name]-[local]-[hash:base64:3]',
      globalModulePaths: [/\.global\.(scss|css)$/, /node_modules/],
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./packages/dyn-ui-react/test/setupTests.ts'],
    globals: true,
  },
});
