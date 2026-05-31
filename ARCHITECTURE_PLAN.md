# AI Playwright Orchestrator - Architecture & Implementation Plan

## Overview
A test automation framework that uses AI-driven orchestration to plan, generate, and heal Playwright tests dynamically.

## Architecture Components

### 1. **Agent Loop** (`src/orchestrator/agent-loop.ts`)
- Main orchestration engine
- Coordinates planning → generation → execution → healing cycle
- Manages state and error recovery
- Entry point for the entire orchestration workflow

### 2. **Planner** (`src/orchestrator/planner.ts`)
- Uses AI to analyze test requirements
- Generates test plans from business logic
- Produces structured test scenarios
- Outputs: Detailed test plans and test cases
- Consumes: `prompts/test-planning.md`

### 3. **Generator** (`src/orchestrator/generator.ts`)
- Converts plans into Playwright test code
- Generates PageObject models
- Creates reusable test utilities
- Outputs: Executable TypeScript test files
- Consumes: `prompts/test-generation.md`

### 4. **Healer** (`src/orchestrator/healer.ts`)
- Detects test failures and brittleness
- Analyzes root causes (selector issues, timing, logic)
- Auto-repairs broken tests
- Suggests improvements
- Consumes: `prompts/healing.md`

### 5. **Playwright Bridge** (`src/orchestrator/playwright-bridge.ts`)
- Abstraction layer for Playwright API
- Handles browser lifecycle management
- Provides cross-browser utilities
- Manages test execution environment

## Directory Structure

```
ai-playwright-orchestrator/
├── src/
│   ├── orchestrator/
│   │   ├── agent-loop.ts          # Main orchestration engine
│   │   ├── planner.ts              # AI test planning
│   │   ├── generator.ts            # Test code generation
│   │   ├── healer.ts               # Test repair & healing
│   │   ├── playwright-bridge.ts    # Playwright abstraction
│   │   └── types.ts                # Shared types & interfaces
│   │
│   ├── prompts/
│   │   ├── test-planning.md        # Planning prompt template
│   │   ├── test-generation.md      # Generation prompt template
│   │   └── healing.md              # Healing prompt template
│   │
│   └── index.ts                    # Main entry point
│
├── playwright/
│   ├── tests/                      # Generated test files
│   ├── pages/                      # Page Object Models
│   └── playwright.config.ts        # Playwright configuration
│
├── ARCHITECTURE_PLAN.md            # This file
├── CONTEXT_POINTER.md              # Context reminder for sessions
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Setup TypeScript configuration
- [ ] Create base interfaces and types (`src/orchestrator/types.ts`)
- [ ] Implement Playwright bridge abstraction (`src/orchestrator/playwright-bridge.ts`)
- [ ] Setup test framework directory structure
- [ ] Configure `tsconfig.json`

### Phase 2: Core Orchestrator (Week 2)
- [ ] Implement agent-loop core logic (`src/orchestrator/agent-loop.ts`)
- [ ] Create planner module foundation (`src/orchestrator/planner.ts`)
- [ ] Create generator module foundation (`src/orchestrator/generator.ts`)
- [ ] Setup prompt template files
- [ ] Create basic CLI interface

### Phase 3: AI Integration (Week 3)
- [ ] Integrate with AI provider (Claude/OpenAI)
- [ ] Implement prompt optimization
- [ ] Complete planner AI logic
- [ ] Complete generator AI logic
- [ ] Test planning flow end-to-end

### Phase 4: Healing & Intelligence (Week 4)
- [ ] Implement healer module (`src/orchestrator/healer.ts`)
- [ ] Add failure detection and analysis
- [ ] Auto-repair capabilities
- [ ] Learning feedback loop
- [ ] Integration with agent loop

### Phase 5: Testing & Polish (Week 5)
- [ ] Integration testing
- [ ] Performance optimization
- [ ] Documentation & examples
- [ ] Example test suites
- [ ] CI/CD setup

## Dependencies

### Current
```json
{
  "playwright": "^1.60.0",
  "typescript": "^6.0.3",
  "ts-node": "^10.9.2",
  "@types/node": "^25.9.1"
}
```

### To Add (Choose one)
- **Anthropic**: `npm install @anthropic-ai/sdk`
- **OpenAI**: `npm install openai`
- **Alternative**: Any LLM provider SDK

### Optional
- `dotenv`: For environment variable management
- `axios`: For HTTP requests if needed
- `winston`: For logging

## Key Concepts

### Test Planning Flow
1. **Input**: User requirements or test spec
2. **Planner** analyzes and creates structured plan
3. **Output**: Detailed test scenarios with steps

### Test Generation Flow
1. **Input**: Test plan from Planner
2. **Generator** creates Playwright code
3. **Output**: `.ts` test files + PageObject models

### Test Healing Flow
1. **Input**: Failed test execution logs
2. **Healer** analyzes failure
3. **Output**: Fixed test code or recommendations

## Important Notes
- Project uses CommonJS module format (`"type": "commonjs"`)
- TypeScript 6.0.3 configured for strict mode
- Requires AI provider SDK integration (not yet added)
- Environment variables should be managed via `.env` file
- All prompt templates are in Markdown for easy editing

## Environment Variables Required
```
AI_PROVIDER=anthropic          # or openai
AI_API_KEY=your_api_key_here
PLAYWRIGHT_TIMEOUT=30000
BROWSER_TYPE=chromium         # chromium, firefox, webkit
HEADLESS=true
```

## Next Steps
1. ✅ Create ARCHITECTURE_PLAN.md (this file)
2. ✅ Create CONTEXT_POINTER.md
3. Add AI provider SDK to `package.json`
4. Create `.env.example` file
5. Implement Phase 1: Foundation
6. Create base types and interfaces
7. Implement Playwright bridge

## Related Documentation
- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Integration docs for chosen AI provider
