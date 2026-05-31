/**
 * AI Playwright Orchestrator - Main Entry Point
 * Exports all public APIs for the framework
 */

import { AgentLoop } from "./orchestrator/agent-loop";
import { TestRunReport } from "./orchestrator/types";

// Classes & Values
export { AgentLoop } from "./orchestrator/agent-loop";
export { Planner } from "./orchestrator/planner";
export { Generator } from "./orchestrator/generator";
export { Healer } from "./orchestrator/healer";
export { PlaywrightBridge } from "./orchestrator/playwright-bridge";

// Configuration Types
export type {
  BrowserType,
  AIProvider,
  LogLevel,
  BrowserConfig,
  AIConfig,
  OrchestratorConfig,
} from "./orchestrator/types";

// Test Planning Types
export type {
  TestStep,
  TestScenario,
  TestPlan,
} from "./orchestrator/types";

// Test Generation Types
export type {
  PageElement,
  PageObjectModel,
  GeneratedTestFile,
  TestCode,
  CodeGeneration,
} from "./orchestrator/types";

// Test Execution Types
export type {
  TestExecutionResult,
  TestSuiteResult,
  TestRunReport,
} from "./orchestrator/types";

// Test Healing Types
export type {
  TestFailure,
  FailureAnalysis,
  HealingResult,
  HealingReport,
} from "./orchestrator/types";

// Agent Loop Types
export type {
  OrchestrationPhase,
  OrchestrationState,
  OrchestrationReport,
} from "./orchestrator/types";

// Prompt Types
export type {
  PromptTemplate,
  PromptContext,
} from "./orchestrator/types";

// Utility Types
export type {
  Logger,
  StorageProvider,
  AIProviderClient,
} from "./orchestrator/types";

// Error Classes
export {
  OrchestratorError,
  PlanningError,
  GenerationError,
  ExecutionError,
  HealingError,
}
from "./orchestrator/types";

async function main() {
  const args = process.argv.slice(2);
  const requirements = args[0];

  if (!requirements) {
    console.error("Usage: ts-node src/index.ts \"<test requirements>\"");
    process.exit(1);
  }

  console.log(`Starting orchestration for requirements: "${requirements}"`);

  const agentLoop = new AgentLoop();

  try {
    const report: TestRunReport = await agentLoop.run(requirements);
    console.log("Orchestration Report:", report);
    if (!report.success) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Orchestration failed:", error);
    process.exit(1);
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}
