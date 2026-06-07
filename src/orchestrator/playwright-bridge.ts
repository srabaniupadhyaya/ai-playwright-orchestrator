/**
 * Playwright Bridge - Browser Abstraction Layer
 * Provides unified interface for test execution and browser control
 */
import { chromium, firefox, webkit, Browser, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { GeneratedTestFile, TestCode, TestExecutionResult, TestSuiteResult } from './types';

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface BrowserConfig {
  type: BrowserType;
  headless: boolean;
  timeout: number;
}

export class PlaywrightBridge {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private config: BrowserConfig;
  private projectRoot: string;

  constructor(config: Partial<BrowserConfig> = {}, projectRoot: string = process.cwd()) {
    this.config = {
      type: 'chromium',
      headless: true,
      timeout: 30000,
      ...config,
    };
    this.projectRoot = projectRoot;
  }

  async launchBrowser(): Promise<void> {
    if (this.browser) return;
    const { type, headless } = this.config;
    if (type === 'chromium') this.browser = await chromium.launch({ headless });
    else if (type === 'firefox') this.browser = await firefox.launch({ headless });
    else this.browser = await webkit.launch({ headless });

    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeout);
  }

   /**
    * Execute a test function that receives a Playwright Page.
    * Useful for programmatic test execution without the test runner.
    */
   public async executeWithPage(fn: (page: Page) => Promise<void>): Promise<void> {
     if (!this.page) {
       await this.launchBrowser();
     }
     if (!this.page) throw new Error('Page not available');
     await fn(this.page);
   }

   /**
    * Write generated test files to disk and execute via Playwright test runner
    * @param testCode - Generated test code (main test file + optional page objects)
    * @param additionalFiles - Additional files (e.g., utilities, helpers)
    * @returns TestSuiteResult with execution results
    */
   public async executeTests(
       testCode: TestCode,
       additionalFiles?: GeneratedTestFile[]
   ): Promise<TestSuiteResult> {
     const testsDir = path.join(this.projectRoot, 'playwright', 'tests');
     const pagesDir = path.join(this.projectRoot, 'playwright', 'pages');

     // Ensure directories exist
     this.ensureDir(testsDir);
     this.ensureDir(pagesDir);

     try {
       // Write main test file
       const mainTestPath = path.join(testsDir, path.basename(testCode.filePath));
       fs.writeFileSync(mainTestPath, testCode.code, 'utf-8');
       console.log(`✓ Written test file: ${mainTestPath}`);

       // Write page object models
       if (testCode.pageObjects && testCode.pageObjects.length > 0) {
         for (const pageObj of testCode.pageObjects) {
           const pageObjPath = path.join(pagesDir, path.basename(pageObj.filePath));
           fs.writeFileSync(pageObjPath, pageObj.code, 'utf-8');
           console.log(`✓ Written page object: ${pageObjPath}`);
         }
       }

       // Write additional files (utilities, helpers, etc.)
       if (additionalFiles && additionalFiles.length > 0) {
         for (const file of additionalFiles) {
           const filePath = path.join(this.projectRoot, 'playwright', file.filePath);
           this.ensureDir(path.dirname(filePath));
           fs.writeFileSync(filePath, file.code, 'utf-8');
           console.log(`✓ Written file: ${filePath}`);
         }
       }

       // Run Playwright tests
       console.log('\n▶ Running Playwright tests...\n');
       return await this.runPlaywrightTests(mainTestPath);
    } catch (err) {
      console.error('PlaywrightBridge.executeTests error:', err);
      throw err;
    }
  }

  /**
   * Run Playwright test runner and capture results
   * @param testFilePath - Path to test file to run
   * @returns TestSuiteResult
   */
  private async runPlaywrightTests(testFilePath: string): Promise<TestSuiteResult> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let stdout = '';
      let stderr = '';

      // Use npx to run playwright test
      const process = spawn('npx', ['playwright', 'test', testFilePath], {
        cwd: this.projectRoot,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true, // Required for Windows PowerShell
      });

      process.stdout.on('data', (data) => {
        const message = data.toString();
        stdout += message;
        console.log(message);
      });

      process.stderr.on('data', (data) => {
        const message = data.toString();
        stderr += message;
        console.error(message);
      });

      process.on('close', (code) => {
        const duration = Date.now() - startTime;
        const success = code === 0;

         // Parse basic results from Playwright output
         // In production, use the JSON reporter for more reliable parsing
         const suiteName = path.basename(testFilePath, '.ts');
         const results: TestExecutionResult[] = this.parsePlaywrightOutput(stdout);

        const suiteResult: TestSuiteResult = {
          suiteName,
          totalTests: results.length,
          passed: results.filter((r) => r.status === 'passed').length,
          failed: results.filter((r) => r.status === 'failed').length,
          skipped: results.filter((r) => r.status === 'skipped').length,
          duration,
          results,
          timestamp: new Date(),
        };

        if (success || code === 1) {
          // code 0 = all passed, code 1 = tests failed but ran
          resolve(suiteResult);
        } else {
          reject(new Error(`Playwright test runner exited with code ${code}`));
        }
      });

      process.on('error', (err) => {
        console.error('Failed to start Playwright test runner:', err);
        reject(err);
      });
    });
  }

   /**
    * Parse Playwright CLI output to extract test results
    * For production use, consider using the JSON reporter instead
    */
   private parsePlaywrightOutput(output: string): TestExecutionResult[] {
     const results: TestExecutionResult[] = [];

     // Extract passed tests
     let match;
     const passedRegex = /✓\s+(.+?)\s+\((\d+)ms\)/g;
     while ((match = passedRegex.exec(output)) !== null) {
       const testName = match[1];
       const duration = match[2];
       if (testName && duration !== undefined) {
         results.push({
           testName: testName.trim(),
           status: 'passed',
           duration: parseInt(duration),
           timestamp: new Date(),
         });
       }
     }

     // Extract failed tests
     const failedRegex = /✗\s+(.+?)(?:\s+\((\d+)ms\))?$/gm;
     while ((match = failedRegex.exec(output)) !== null) {
       const testName = match[1];
       const duration = match[2];
       if (testName) {
         results.push({
           testName: testName.trim(),
           status: 'failed',
           duration: duration ? parseInt(duration) : 0,
           error: 'Test failed (see logs for details)',
           timestamp: new Date(),
         });
       }
     }

     // Fallback: if no tests parsed, extract from test summary
     if (results.length === 0) {
       const summaryMatch = output.match(/(\d+)\s+passed/);
       if (summaryMatch && summaryMatch[1]) {
         const passedCount = parseInt(summaryMatch[1]);
         for (let i = 0; i < passedCount; i++) {
           results.push({
             testName: `Test ${i + 1}`,
             status: 'passed',
             duration: 0,
             timestamp: new Date(),
           });
         }
       }
     }

     return results;
   }

   /**
    * Helper to ensure directory exists
    */
   private ensureDir(dirPath: string): void {
     if (!fs.existsSync(dirPath)) {
       fs.mkdirSync(dirPath, { recursive: true });
     }
   }

   public async closeBrowser(): Promise<void> {
     try {
       if (this.context) {
         await this.context.close();
         this.context = null;
       }
       if (this.browser) {
         await this.browser.close();
         this.browser = null;
       }
       this.page = null;
     } catch (err) {
       console.error('PlaywrightBridge.closeBrowser error', err);
     }
   }
}

export default PlaywrightBridge;
