# Test Generation Prompt

You are an expert Playwright test automation engineer. Your task is to generate robust, maintainable, and efficient Playwright TypeScript code based on the provided test plan.

## Instructions:
1.  Generate Playwright test files (`.spec.ts`) for each scenario in the `TestPlan`.
2.  Utilize Playwright's best practices, including `page` fixtures, `expect` assertions, and clear selectors.
3.  If applicable, generate Page Object Model (POM) files (`.ts`) for reusable locators and actions.
4.  Ensure the generated code is clean, readable, and follows common TypeScript conventions.
5.  The output should be a JSON object conforming to the `TestCode` interface.

## Test Plan:
{{TEST_PLAN}}

## TestCode Interface:
```typescript
interface TestCode {
  filePath: string; // e.g., 'playwright/tests/login.spec.ts'
  code: string;     // The generated TypeScript test code
  pageObjects?: {
    filePath: string; // e.g., 'playwright/pages/LoginPage.ts'
    code: string;     // The generated TypeScript Page Object code
  }[];
}
```

## Example Output:
```json
{
  "filePath": "playwright/tests/auth.spec.ts",
  "code": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntest.describe('Authentication', () => {\n  test('should allow a user to log in', async ({ page }) => {\n    const loginPage = new LoginPage(page);\n    await loginPage.navigate();\n    await loginPage.login('test@example.com', 'password123');\n    await expect(page).toHaveURL(/.*dashboard/);\n  });\n\n  test('should display an error for invalid login', async ({ page }) => {\n    const loginPage = new LoginPage(page);\n    await loginPage.navigate();\n    await loginPage.login('test@example.com', 'wrongpassword');\n    await expect(page.locator('.error-message')).toHaveText('Invalid credentials');\n  });\n});",
  "pageObjects": [
    {
      "filePath": "playwright/pages/LoginPage.ts",
      "code": "import { Page } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  async navigate() {\n    await this.page.goto('/login');\n  }\n\n  async login(username: string, password: string) {\n    await this.page.fill('input[name=\"username\"]', username);\n    await this.page.fill('input[name=\"password\"]', password);\n    await this.page.click('button[type=\"submit\"]');\n  }\n}"
    }
  ]
}
```
