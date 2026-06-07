// src/orchestrator/planner.ts

import * as fs from 'fs';
import * as path from 'path';
import { TestPlan } from './types';
import type { AIProviderClient } from './types';

/**
 * Planner - uses an AI client to convert requirements into a structured TestPlan.
 * The constructor accepts any implementation of AIProviderClient (Gemini/OpenAI adapter).
 */
export class Planner {
  private aiClient: AIProviderClient;
  private promptTemplate: string;

  constructor(aiClient: AIProviderClient) {
    this.aiClient = aiClient;

    // Try loading prompt template from src/prompts/test-planning.md
    const promptPath = path.resolve(process.cwd(), 'src', 'prompts', 'test-planning.md');
    if (fs.existsSync(promptPath)) {
      this.promptTemplate = fs.readFileSync(promptPath, 'utf8');
    } else {
      // Fallback prompt (simple)
      this.promptTemplate = `
You are an expert test automation engineer. Analyze the following requirements and produce a JSON TestPlan.

Requirements:
{REQUIREMENTS}

Return ONLY valid JSON conforming to the TestPlan shape:
{
  "id": "string",
  "name": "string",
  "description": "string",
  "scenarios": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "preconditions": ["string"],
      "steps": [
        { "action": "navigate|click|fill|assert|wait|other", "selector": "string?", "value": "string?", "expectedBehavior": "string?" }
      ],
      "expectedResult": "string",
      "priority": "high|medium|low",
      "tags": ["string"]
    }
  ]
}
`;
    }
  }

  /**
   * Light runtime validator for AI output.
   * Use `any` here on purpose so TypeScript does not treat typeof checks as redundant.
   */
  private isValidTestPlan(obj: any): obj is TestPlan {
    return (
        obj &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        Array.isArray(obj.scenarios)
    );
  }

  /**
   * Create a TestPlan from free-text requirements.
   * Uses the provided AI client to generate structured JSON.
   * If AI generation fails or returns invalid output, returns a mock plan.
   */
  public async createTestPlan(requirements: string): Promise<TestPlan> {
    console.log(`Planner: Creating test plan for requirements: "${requirements}"`);

    const prompt = this.promptTemplate.replace('{REQUIREMENTS}', requirements);

    try {
      // Ask the AI to return JSON that matches the TestPlan interface
      const result = await this.aiClient.generateJSON<TestPlan>(prompt);

      // Runtime validation against unknown/any to ensure safety
      if (this.isValidTestPlan(result)) {
        console.log('Planner: Received TestPlan from AI.');
        return result;
      } else {
        console.warn('Planner: AI returned invalid TestPlan shape; falling back to mock.');
        return this.createMockTestPlan(requirements);
      }
    } catch (err) {
      console.error('Planner: AI generation failed, falling back to mock plan.', err);
      return this.createMockTestPlan(requirements);
    }
  }

  private createMockTestPlan(requirements: string): TestPlan {
    return {
      id: 'plan-mock',
      name: 'Mock Test Plan',
      description: `Mock plan generated for requirements: "${requirements}"`,
      scenarios: [
        {
          id: 'scenario-1',
          name: 'Basic smoke test',
          description: 'A simple smoke scenario created as a fallback.',
          preconditions: ['Application is reachable'],
          steps: [
            { action: 'navigate', value: '/' },
            { action: 'assert', expectedBehavior: 'Page loads without error' },
          ],
          expectedResult: 'Application home page loads',
          priority: 'high',
          tags: ['smoke'],
        },
      ],
    };
  }
}