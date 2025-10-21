import { expect, test } from '@playwright/test';

test.describe('Dyn UI visual regression', () => {
  test('button gallery matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 1280, height: 720 });

    const section = page.locator('section:has(h2:has-text("Button Kinds"))');
    await expect(section).toBeVisible();

    await expect(section).toHaveScreenshot('button-kinds.png', {
      animations: 'disabled',
    });
  });
});
