
import { test, expect } from '@playwright/test';

test.describe('User Login Test Plan', () => {
  test('should allow a user to log in successfully', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show an error for invalid password', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('.error-message')).toHaveText('Invalid credentials');
  });
});
      