/**
 * Shared Types & Interfaces - Central Type Definitions
 * Used across all orchestrator modules
 */

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export type BrowserType = "chromium" | "firefox" | "webkit";
export type AIProvider = "anthropic" | "openai";
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface BrowserConfig {
  type: BrowserType;
  headless: boolean;
  timeout: number;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

export interface OrchestratorConfig {
  browser: BrowserConfig;
  ai: AIConfig;
  logging?: {
    level: LogLevel;
    filePath?: string;
  };
  retryAttempts?: number;
}

// ============================================================================
// TEST PLANNING TYPES
// ============================================================================

export interface TestStep {
  action: string;
  selector?: string;
  value?: string;
  expectedBehavior?: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description?: string;
  preconditions?: string[];
  steps: TestStep[];
  expectedResult: string;
  priority?: "high" | "medium" | "low";
  tags?: string[];
}

export interface TestPlan {
  id: string; // Added id to match prompt example
  name: string; // Changed from title to name to match prompt example
  description: string;
  scope?: string;
  objectives?: string[];
  scenarios: TestScenario[];
  createdAt?: Date; // Made optional as it's not in prompt example
  version?: string; // Made optional as it's not in prompt example
}

// ============================================================================
// TEST GENERATION TYPES
// ============================================================================

export interface PageElement {
  name: string;
  selector: string;
  type: "button" | "input" | "text" | "link" | "other";
  description?: string;
}

export interface PageObjectModel {
  name: string;
  url?: string;
  elements: PageElement[];
  methods?: {
    name: string;
    description?: string;
    parameters?: Record<string, string>;
  }[];
}

export interface GeneratedTestFile {
  filePath: string;
  code: string;
}

export interface TestCode {
  filePath: string; // Main test file path
  code: string;     // Main test file content
  pageObjects?: GeneratedTestFile[]; // Array of page object files
}

export interface CodeGeneration {
  tests: GeneratedTestFile[];
  utilities?: string;
  helpers?: string;
}

// ============================================================================
// TEST EXECUTION TYPES
// ============================================================================

export interface TestExecutionResult {
  testName: string;
  status: "passed" | "failed" | "skipped" | "timeout";
  duration: number; // milliseconds
  error?: string;
  stackTrace?: string;
  screenshots?: string[];
  logs?: string[];
  timestamp: Date;
}

export interface TestSuiteResult {
  suiteName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  results: TestExecutionResult[];
  timestamp: Date;
}

export interface TestRunReport {
  success: boolean;
  message: string;
  // Add more detailed report data here as needed, e.g.,
  // testPlan?: TestPlan;
  // generatedCode?: TestCode;
  // testSuiteResult?: TestSuiteResult;
  // healingReport?: HealingReport;
}

// ============================================================================
// TEST HEALING TYPES
// ============================================================================

export interface TestFailure {
  testName: string;
  error: string;
  stackTrace: string;
}

export interface FailureAnalysis {
  rootCause: string;
  failureType:
    | "selector_not_found"
    | "timeout"
    | "assertion_failed"
    | "navigation_error"
    | "other";
  affectedElements?: string[];
  suggestedFixes: string[];
  confidence: number; // 0-1
}

export interface HealingResult {
  testName: string;
  originalError: string;
  analysis: FailureAnalysis;
  repairAttempt: string;
  fixedCode?: string;
  success: boolean;
  timestamp: Date;
}

export interface HealingReport {
  totalFailures: number;
  healed: number;
  failedToHeal: number;
  results: HealingResult[];
  timestamp: Date;
}

// ============================================================================
// AGENT LOOP TYPES
// ============================================================================

export type OrchestrationPhase =
  | "planning"
  | "generation"
  | "execution"
  | "analysis"
  | "healing"
  | "reporting";

export interface OrchestrationState {
  phase: OrchestrationPhase;
  startTime: Date;
  requirement?: string;
  testPlan?: TestPlan;
  generatedTests?: GeneratedTestFile[];
  executionResults?: TestSuiteResult;
  healingReport?: HealingReport;
  errors: string[];
  retryCount: number;
}

export interface OrchestrationReport {
  success: boolean;
  phases: Map<OrchestrationPhase, boolean>;
  totalDuration: number;
  testPlan?: TestPlan;
  generatedTests?: GeneratedTestFile[];
  executionResults?: TestSuiteResult;
  healingReport?: HealingReport;
  errors: string[];
  timestamp: Date;
}

// ============================================================================
// PROMPT TEMPLATE TYPES
// ============================================================================

export interface PromptTemplate {
  name: string;
  version: string;
  content: string;
  variables: Record<string, string>;
  examples?: string[];
}

export interface PromptContext {
  testRequirement?: string;
  testPlan?: TestPlan;
  generatedCode?: string;
  failureAnalysis?: FailureAnalysis;
  additionalContext?: Record<string, any>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface Logger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
}

export interface StorageProvider {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export interface AIProviderClient {
  generateText(prompt: string, context?: PromptContext): Promise<string>;
  generateJSON<T = any>(prompt: string, context?: PromptContext): Promise<T>;
  embedText(text: string): Promise<number[]>;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class OrchestratorError extends Error {
  constructor(
    public code: string,
    message: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = "OrchestratorError";
  }
}

export class PlanningError extends OrchestratorError {
  constructor(message: string, context?: Record<string, any>) {
    super("PLANNING_ERROR", message, context);
    this.name = "PlanningError";
  }
}

export class GenerationError extends OrchestratorError {
  constructor(message: string, context?: Record<string, any>) {
    super("GENERATION_ERROR", message, context);
    this.name = "GenerationError";
  }
}

export class ExecutionError extends OrchestratorError {
  constructor(message: string, context?: Record<string, any>) {
    super("EXECUTION_ERROR", message, context);
    this.name = "ExecutionError";
  }
}

export class HealingError extends OrchestratorError {
  constructor(message: string, context?: Record<string, any>) {
    super("HEALING_ERROR", message, context);
    this.name = "HealingError";
  }
}
