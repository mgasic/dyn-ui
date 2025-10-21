import { test, expect } from '@playwright/test';

test.describe('DynButton demo interactions', () => {
  test('primary button is visible and clickable', async ({ page }) => {
    await page.goto('/');
    const button = page
      .getByRole('button', { name: /primary button/i })
      .first();
    await expect(button).toBeVisible();
    await button.click();
  });

  test('loading state toggles via interaction', async ({ page }) => {
    await page.goto('/');
    const loadingTrigger = page.getByRole('button', {
      name: /click to test loading/i,
    });
    await expect(loadingTrigger).toBeEnabled();
    await loadingTrigger.click();
    await expect(loadingTrigger).toHaveAttribute('aria-busy', 'true');
  });
});
