import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}

const smokeOnly = process.env.STORYBOOK_SMOKE === 'true';
const stories = smokeOnly
  ? ['../stories/qa-smoke.stories.tsx']
  : [
      '../stories/**/*.mdx',
      '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
      // Dodaj i naše DynButton stories
      '../packages/dyn-ui-react/src/**/*.stories.@(js|jsx|ts|tsx)',
    ];

const config: StorybookConfig = {
  stories,
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    //getAbsolutePath("@storybook/addon-vitest"),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  // ===== DODAJ OVDE viteFinal =====
  viteFinal: async (config) => {
    // Dodaj alias za workspace dependency
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'dyn-ui-react': join(__dirname, '../packages/dyn-ui-react/src'),
    };

    return config;
  },
};

export default config;
