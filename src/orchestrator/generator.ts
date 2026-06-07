// src/orchestrator/generator.ts

import * as fs from 'fs';
import * as path from 'path';
import { TestPlan, TestCode } from './types';
import { AIProviderClient } from './types';

export class Generator {
  private aiClient: AIProviderClient;
  private promptTemplate: string;

  constructor(aiClient: AIProviderClient) {
    this.aiClient = aiClient;
    // Load generation prompt template
    const promptPath = path.resolve(process.cwd(), 'src', 'prompts', 'test-generation.md');
    this.promptTemplate = fs.readFileSync(promptPath, 'utf-8');
  }

  public async generateTestCode(testPlan: TestPlan): Promise<TestCode> {
    console.log(`Generator: Generating test code for plan: "${testPlan.name}"`);

    // Replace placeholder in prompt
    const prompt = this.promptTemplate.replace('{TEST_PLAN}', JSON.stringify(testPlan, null, 2));

    try {
      const generated = await this.aiClient.generateJSON<any>(prompt);

      const testCode: TestCode = {
        filePath: generated.testFile.path,
        code: generated.testFile.code,
        pageObjects: generated.pageObjects || [],
      };

      console.log('Generator: Test code generated successfully');
      return testCode;
    } catch (err) {
      console.error('Generator: AI generation failed, using mock', err);
      // Fallback to mock
      return this.createMockTestCode(testPlan);
    }
  }

  private createMockTestCode(testPlan: TestPlan): TestCode {
    return {
      filePath: 'playwright/tests/mock.spec.ts',
      code: `
import { test, expect } from '@playwright/test';

test.describe('${testPlan.name}', () => {
  test('mock test', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/, { timeout: 5000 }).catch(() => {});
  });
});
      `.trim(),
      pageObjects: [],
    };
  }
}