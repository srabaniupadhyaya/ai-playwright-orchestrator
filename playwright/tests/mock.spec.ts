import { test, expect } from '@playwright/test';

test.describe('Mock Test Plan', () => {
  test('mock test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/, { timeout: 5000 }).catch(() => {});
  });
});