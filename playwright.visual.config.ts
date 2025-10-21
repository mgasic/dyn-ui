import baseConfig from './playwright.config';
import { defineConfig, devices } from '@playwright/test';

const chromiumProject = Array.isArray(baseConfig.projects)
  ? (baseConfig.projects.find((project) => project.name === 'chromium') ??
    baseConfig.projects[0])
  : undefined;

export default defineConfig({
  ...baseConfig,
  testDir: './tests/visual',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright/visual', open: 'never' }],
    ['junit', { outputFile: 'reports/playwright/visual/results.xml' }],
  ],
  projects: [
    chromiumProject ?? {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
