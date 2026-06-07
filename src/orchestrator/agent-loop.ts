// src/orchestrator/agent-loop.ts

import { Planner } from './planner';
import { Generator } from './generator';
import PlaywrightBridge from './playwright-bridge';
import { Healer } from './healer';
import {
  TestRunReport,
  TestPlan,
  TestCode,
  TestSuiteResult,
  OrchestratorConfig,
} from './types';

export class AgentLoop {
  private planner: Planner;
  private generator: Generator;
  private playwrightBridge: PlaywrightBridge;
  private healer: Healer;
  private config: OrchestratorConfig;

  constructor(config?: Partial<OrchestratorConfig>) {
    this.planner = new Planner();
    this.generator = new Generator();
    // Pass basic browser config (you can make this env-driven later)
    this.playwrightBridge = new PlaywrightBridge(
        {
          type: (config?.browser?.type as any) || 'chromium',
          headless: config?.browser?.headless ?? true,
          timeout: config?.browser?.timeout ?? 30000,
        },
        process.cwd()
    );
    this.healer = new Healer();

    this.config = {
      browser: {
        type: (config?.browser?.type as any) || 'chromium',
        headless: config?.browser?.headless ?? true,
        timeout: config?.browser?.timeout ?? 30000,
      },
      ai: {
        provider: (config?.ai?.provider as any) || 'openai',
        apiKey: config?.ai?.apiKey ?? '',
      },
      logging: config?.logging ?? { level: 'info' },
      retryAttempts: config?.retryAttempts ?? 1,
    };
  }

  /**
   * Run the orchestration: planning -> generation -> execution -> healing (optional retry)
   */
  public async run(requirements: string): Promise<TestRunReport> {
    console.log('AgentLoop: Starting orchestration...');
    const start = Date.now();

    // Phase: Planning
    console.log('AgentLoop: Planning phase...');
    let testPlan: TestPlan;
    try {
      testPlan = await this.planner.createTestPlan(requirements);
      console.log('AgentLoop: Test plan created.', testPlan);
    } catch (err) {
      console.error('AgentLoop: Planning failed', err);
      return { success: false, message: `Planning failed: ${String(err)}` };
    }

    // Phase: Generation
    console.log('AgentLoop: Generation phase...');
    let testCode: TestCode;
    try {
      testCode = await this.generator.generateTestCode(testPlan);
      console.log('AgentLoop: Test code generated.', testCode.filePath);
    } catch (err) {
      console.error('AgentLoop: Generation failed', err);
      return { success: false, message: `Generation failed: ${String(err)}` };
    }

    // Phase: Execution
    console.log('AgentLoop: Execution phase...');
    let suiteResult: TestSuiteResult;
    try {
      suiteResult = await this.playwrightBridge.executeTests(testCode);
      console.log('AgentLoop: Execution result:', {
        total: suiteResult.totalTests,
        passed: suiteResult.passed,
        failed: suiteResult.failed,
      });
    } catch (err) {
      console.error('AgentLoop: Execution failed', err);
      return { success: false, message: `Execution failed: ${String(err)}` };
    }

    // Convert suiteResult to TestRunReport
    const initialReport: TestRunReport = {
      success: suiteResult.failed === 0,
      message:
          suiteResult.failed === 0
              ? 'All tests passed'
              : `${suiteResult.failed} test(s) failed`,
      // More fields may be added to TestRunReport in the future (testPlan, generatedCode, executionResults)
    };

    // Phase: Healing (if failures)
    if (!initialReport.success && this.config.retryAttempts && this.config.retryAttempts > 0) {
      console.log('AgentLoop: Failures detected, attempting healing...');
      try {
        const healReport = await this.healer.healTests(initialReport);
        console.log('AgentLoop: Healer returned:', healReport);

        // If healer produced a repairAttempt or changed the code, you could re-generate or re-run.
        // For now, attempt a single re-run if healer indicates success === true.
        if (healReport.success) {
          console.log('AgentLoop: Healer indicates success, re-running tests...');
          try {
            const reRunResult = await this.playwrightBridge.executeTests(testCode);
            return {
              success: reRunResult.failed === 0,
              message:
                reRunResult.failed === 0
                  ? 'All tests passed after healing'
                  : `${reRunResult.failed} test(s) failed after healing`,
            };
          } catch (err) {
            console.error('AgentLoop: Re-run after healing failed:', err);
            return { success: false, message: `Re-run failed: ${String(err)}` };
          }
        } else {
          // Healer did not succeed — return initial report with healing info
          return {
            success: false,
            message: `Tests failed and healing did not resolve issues: ${initialReport.message}`,
          };
        }
      } catch (err) {
        console.error('AgentLoop: Healing failed', err);
        return { success: false, message: `Healing failed: ${String(err)}` };
      }
    }

    // No failures or no healing needed
    const duration = Date.now() - start;
    console.log(`AgentLoop: Orchestration complete (${duration} ms).`);

    return initialReport;
  }
}