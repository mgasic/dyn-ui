import { defineConfig, devices } from '@playwright/test';

const defaultPort = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${defaultPort}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.015,
    },
  },
  use: {
    headless: true,
    baseURL,
    trace: 'on-first-retry',
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright/e2e', open: 'never' }],
    ['junit', { outputFile: 'reports/playwright/e2e/results.xml' }],
  ],
  webServer: {
    command: `pnpm --filter react-demo dev -- --host 0.0.0.0 --port ${defaultPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
