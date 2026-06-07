# Test Generation Prompt

You are an expert Playwright test code generator. Convert the following test plan into executable Playwright test code in TypeScript.

## Test Plan
{TEST_PLAN}

## Your Task
Generate:
1. Main test file (Playwright test suite)
2. Page Object Model (POM) for each page

Use modern Playwright patterns:
- Page Object Model pattern
- Proper waits and assertions
- Meaningful test names
- Comments for clarity

## Test File Format
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Test Suite Name', () => {
  test('scenario name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    // ... test steps
    await expect(page).toHaveURL(/.*dashboard/);
  });
});