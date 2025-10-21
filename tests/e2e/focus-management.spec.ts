import { test, expect } from '@playwright/test';

const STORYBOOK_BASE_URL = process.env.STORYBOOK_BASE_URL ?? 'http://localhost:6006';

test.describe('Focus management', () => {
  test('DynMenu returns focus to the trigger after closing the submenu', async ({ page }) => {
    await page.goto(`${STORYBOOK_BASE_URL}/iframe.html?id=navigation-dynmenu--default`);

    const productsTrigger = page.getByRole('menuitem', { name: 'Products' });
    await productsTrigger.click();
    await expect(page.getByRole('menuitem', { name: 'All Products' })).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('menuitem', { name: 'All Products' })).not.toBeVisible();
    await expect(productsTrigger).toBeFocused();
  });

  test('DynToolbar overflow menu restores focus to the toggle button', async ({ page }) => {
    await page.goto(`${STORYBOOK_BASE_URL}/iframe.html?id=navigation-dyntoolbar--responsiveoverflow`);

    const overflowButton = page.getByLabel('More actions');
    await overflowButton.click();

    const overflowMenu = page.getByRole('menu');
    await expect(overflowMenu).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(overflowMenu).not.toBeVisible();
    await expect(overflowButton).toBeFocused();
  });

  test('DynModal restores focus to the opener after dismissal', async ({ page }) => {
    await page.goto(`${STORYBOOK_BASE_URL}/iframe.html?id=components-dynmodal--basic`);

    const openButton = page.getByRole('button', { name: 'Open modal' });
    await openButton.click();

    const dialog = page.getByRole('dialog', { name: /modal dialog/i });
    await expect(dialog).toBeVisible();

    const confirmButton = page.getByRole('button', { name: 'Confirm' });
    await confirmButton.click();

    await expect(openButton).toBeFocused();
  });
});

