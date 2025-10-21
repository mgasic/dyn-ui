import { test, expect } from '@playwright/test';

test.describe('Dyn UI demo accessibility smoke', () => {
  test('page has accessible title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/dyn ui demo/i);
  });

  test('hero heading has semantic role', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', {
      level: 1,
      name: /dyn ui demo/i,
    });
    await expect(heading).toBeVisible();
  });
});
