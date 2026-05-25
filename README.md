# AI Playwright Orchestrator

🤖 **Native AI-Driven Test Automation Framework** - Uses AI agents to intelligently plan, generate, and automatically heal Playwright tests.

## 🎯 Overview

AI Playwright Orchestrator is a comprehensive test automation framework that leverages AI to:

- **Plan** test scenarios automatically from requirements
- **Generate** Playwright test code without manual writing
- **Heal** failing tests by analyzing failures and suggesting fixes
- **Orchestrate** the entire testing workflow through an intelligent agent loop

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  AGENT LOOP                         │
│  (Main orchestration engine)                        │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────────┐
        ↓          ↓          ↓              ↓
    [PLANNER]  [GENERATOR] [HEALER]  [PLAYWRIGHT]
    (Plans)    (Generates)  (Repairs)  (Executes)
```

### Core Modules

| Module | Purpose | Location |
|--------|---------|----------|
| **Agent Loop** | Orchestrates the workflow | `src/orchestrator/agent-loop.ts` |
| **Planner** | AI test planning | `src/orchestrator/planner.ts` |
| **Generator** | AI code generation | `src/orchestrator/generator.ts` |
| **Healer** | Automatic test repair | `src/orchestrator/healer.ts` |
| **Playwright Bridge** | Browser abstraction | `src/orchestrator/playwright-bridge.ts` |

## 📁 Project Structure

```
ai-playwright-orchestrator/
├── src/
│   ├── orchestrator/
│   │   ├── agent-loop.ts
│   │   ├── planner.ts
│   │   ├── generator.ts
│   │   ├── healer.ts
│   │   └── playwright-bridge.ts
│   ├── prompts/
│   │   ├── test-planning.md
│   │   ├── test-generation.md
│   │   └── healing.md
│   └── index.ts
├── playwright/
│   ├── tests/
│   ├── pages/
│   └── playwright.config.ts
├── package.json
├── tsconfig.json
├── ARCHITECTURE_PLAN.md
├── CONTEXT_POINTER.md
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
# Clone and setup
npm install

# Add AI provider
npm install @anthropic-ai/sdk  # or npm install openai
```

### Configuration

Create a `.env` file:

```env
# AI Configuration
AI_PROVIDER=anthropic  # or openai
AI_API_KEY=your_api_key_here

# Testing Configuration
BROWSER_TYPE=chromium
HEADLESS=true
PLAYWRIGHT_TIMEOUT=30000
BASE_URL=http://localhost:3000
```

### Build & Run

```bash
# Compile TypeScript
npm run build

# Run tests
npm run test

# Watch mode (development)
npm run dev
```

## 📋 Tech Stack

- **Language**: TypeScript 6.0.3
- **Browser Automation**: Playwright 1.60.0
- **Runtime**: Node.js
- **AI Provider**: Anthropic Claude or OpenAI (to be configured)
- **Build Tool**: TypeScript Compiler

## 🔄 Testing Workflow

```
User Requirements/Specification
           ↓
    [PLANNER] - Analyze & Create Test Plan
           ↓
   [GENERATOR] - Generate Playwright Test Code
           ↓
[PLAYWRIGHT BRIDGE] - Execute Tests
           ↓
    Results + Logs
           ↓
    Test Passed? ─→ NO ─→ [HEALER] - Analyze & Repair
           ↓                   ↓
          YES      Retry with Fixed Code
           ↓                   ↓
        Report ─←─────────────┘
```

## 🤖 AI-Powered Features

### Smart Planning
- Analyzes requirements and generates comprehensive test plans
- Identifies edge cases and boundary conditions
- Suggests test data requirements

### Intelligent Generation
- Generates clean, maintainable Playwright code
- Follows Page Object Model pattern
- Includes proper waits and error handling
- Uses reliable selectors and best practices

### Auto-Healing
- Detects test failures automatically
- Analyzes root causes (selector changes, timing issues, etc.)
- Suggests and applies fixes
- Learns from failures

## 🛠️ Development

### Scripts

```json
{
  "build": "tsc",
  "dev": "tsc --watch",
  "test": "playwright test",
  "test:debug": "playwright test --debug",
  "test:headed": "playwright test --headed",
  "lint": "eslint src/"
}
```

### TypeScript Configuration

- **Strict Mode**: Enabled
- **ESNext Target**: Latest
- **Module System**: CommonJS

## 📚 Documentation

- **[CONTEXT_POINTER.md](./CONTEXT_POINTER.md)** - Session context & quick reference
- **[ARCHITECTURE_PLAN.md](./ARCHITECTURE_PLAN.md)** - Complete implementation roadmap
- **[Playwright Docs](https://playwright.dev)** - Official Playwright documentation

## 🔐 Security

- API keys stored in environment variables
- No sensitive data in version control
- Regular dependency updates

## 🔄 Development Phases

- **Phase 1**: Foundation (setup, base abstractions) ✅
- **Phase 2**: Core Orchestrator (agent loop, planner, generator)
- **Phase 3**: AI Integration (AI provider SDK, prompt optimization)
- **Phase 4**: Healing & Intelligence (auto-repair system)
- **Phase 5**: Testing & Polish (integration tests, documentation)

## 📖 Example Usage (Coming Soon)

```typescript
import { AgentLoop } from './src';

const orchestrator = new AgentLoop();
const requirements = `
  Test the login feature:
  - Valid credentials should succeed
  - Invalid credentials should show error
  - Empty fields should show validation
`;

await orchestrator.run();
```

## 🤝 Contributing

Follow the architectural patterns established in this project:
- Use the 5-module architecture
- Store prompts as markdown in `src/prompts/`
- Place generated tests in `playwright/tests/`
- Use TypeScript strict mode
- Follow Page Object Model pattern

## 📝 License

[Add your license here]

## 📞 Support

For issues or questions, please refer to:
- CONTEXT_POINTER.md for quick reference
- ARCHITECTURE_PLAN.md for detailed plans
- Playwright documentation for browser automation help

---

**Created**: May 2026  
**Framework**: AI Playwright Orchestrator v1.0

