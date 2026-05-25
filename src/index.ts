/**
 * AI Playwright Orchestrator - Main Entry Point
 * Exports all public APIs for the framework
 */

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
  GeneratedTest,
  CodeGeneration,
} from "./orchestrator/types";

// Test Execution Types
export type {
  TestExecutionResult,
  TestSuiteResult,
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
} from "./orchestrator/types";

