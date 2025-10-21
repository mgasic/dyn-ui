import baseConfig from './playwright.config';
import { defineConfig, devices } from '@playwright/test';

const chromiumProject = Array.isArray(baseConfig.projects)
  ? (baseConfig.projects.find((project) => project.name === 'chromium') ??
    baseConfig.projects[0])
  : undefined;

export default defineConfig({
  ...baseConfig,
  testDir: './tests/a11y',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright/a11y', open: 'never' }],
    ['junit', { outputFile: 'reports/playwright/a11y/results.xml' }],
  ],
  projects: [
    chromiumProject ?? {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
