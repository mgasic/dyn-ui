import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

const ANALYZE_BUNDLE = process.env.BUNDLE_ANALYZE === 'true';
const bundleReportPath = resolve(__dirname, '../../reports/bundle/dyn-ui-react.html');

export default defineConfig({
  plugins: [react()],

  // CSS Module optimization for shorter class names
  css: {
    modules: {
      // Production: use very short hashes (5 chars)
      // Development: use readable names with short hash (3 chars)
      generateScopedName: process.env.NODE_ENV === 'production'
        ? 'dyn-[hash:base64:5]'  // e.g., "dyn-a1b2c"
        : '[name]-[local]-[hash:base64:3]', // e.g., "DynButton-primary-abc"

      // Don't hash these patterns
      globalModulePaths: [
        /\.global\.(scss|css)$/,
        /node_modules/
      ],

      // Export configuration
      localsConvention: 'camelCaseOnly'
    },

    // SCSS preprocessing
    preprocessorOptions: {
      scss: {
        additionalData: `
          // Add global SCSS variables if needed
          // @import "src/styles/variables";
          // @import "src/styles/mixins";
        `,
        includePaths: ['src/styles']
      }
    }
  },

  // Build optimization
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'DynUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `dyn-ui.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      },
      plugins: ANALYZE_BUNDLE
        ? [
            visualizer({
              filename: bundleReportPath,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap'
            })
          ]
        : [],
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types')
    }
  }
});
