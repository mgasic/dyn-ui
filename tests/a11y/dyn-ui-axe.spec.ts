import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const reportDir = join(process.cwd(), 'reports', 'playwright', 'a11y');

async function writeReport(fileName: string, data: unknown) {
  await mkdir(reportDir, { recursive: true });
  await writeFile(join(reportDir, fileName), JSON.stringify(data, null, 2));
}

test.describe('Axe accessibility audit', () => {
  test('Dyn UI demo home passes WCAG A/AA rules', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // High contrast variations tested separately
      .analyze();

    await writeReport('axe-report.json', results);

    expect(results.violations, 'axe-core found violations').toEqual([]);
  });
});
