import { mergeConfig, defineConfig } from 'vite';
import baseConfig from './vite.config';
import { resolve } from 'path';
import { performanceBudgetPlugin } from './scripts/performanceBudgetPlugin';

const bundleReportDir = resolve(__dirname, '../../reports/bundle');

export default mergeConfig(
  baseConfig,
  defineConfig({
    build: {
      lib: {
        entry: resolve(__dirname, 'src/components/DynButton/index.ts'),
        name: 'DynUIButton',
        formats: ['es', 'cjs'],
        fileName: (format) => `dyn-ui-ci.${format}.js`,
      },
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
        plugins: [
          performanceBudgetPlugin({
            budgets: [
              { file: 'dyn-ui-ci.es.js', gzipLimitKb: 30, brotliLimitKb: 25 },
              { file: 'dyn-ui-ci.cjs.js', gzipLimitKb: 35, brotliLimitKb: 30 },
            ],
            reportPath: resolve(bundleReportDir, 'performance-budget.json'),
          }),
        ],
      },
    },
  }),
);
