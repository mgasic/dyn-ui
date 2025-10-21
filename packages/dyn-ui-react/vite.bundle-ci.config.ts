import { mergeConfig, defineConfig } from 'vite';
import baseConfig from './vite.config';
import { resolve } from 'path';

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
      },
    },
  }),
);
