# Project Context Pointer

**⚠️ READ THIS FIRST WHEN STARTING A NEW SESSION**

## Project Name & Overview
**AI Playwright Orchestrator** - Native AI-Driven Test Automation Framework

- **Purpose**: Uses AI agents to plan, generate, and automatically heal Playwright tests
- **Location**: `C:\Users\sraba\SrabaniImp\SrabaniStudyAutomation\ai-playwright-orchestrator`
- **Tech Stack**: TypeScript, Playwright, Node.js, AI LLM Provider (to be added)
- **Created**: May 2026

## 🎯 Quick Reference

### Main Architecture Documents
- **Full Plan**: See `ARCHITECTURE_PLAN.md` for complete implementation roadmap
- **Current Phase**: Phase 1 - Foundation (setup and base abstractions)

### Core Components (5 Modules)
1. **Agent Loop** (`src/orchestrator/agent-loop.ts`) - Main orchestration engine
2. **Planner** (`src/orchestrator/planner.ts`) - AI test planning module
3. **Generator** (`src/orchestrator/generator.ts`) - Test code generation
4. **Healer** (`src/orchestrator/healer.ts`) - Automatic test repair
5. **Playwright Bridge** (`src/orchestrator/playwright-bridge.ts`) - Browser abstraction layer

### Directory Structure
```
src/
├── orchestrator/          ← Core business logic
│   ├── agent-loop.ts     ← Main entry point
│   ├── planner.ts        ← AI planning logic
│   ├── generator.ts      ← Code generation
│   ├── healer.ts         ← Test repair
│   └── playwright-bridge.ts  ← Browser control
│
├── prompts/              ← AI prompt templates
│   ├── test-planning.md
│   ├── test-generation.md
│   └── healing.md
│
└── index.ts              ← Public API export

playwright/
├── tests/                ← Generated test files
├── pages/                ← Page Object Models
└── playwright.config.ts  ← Configuration
```

## Current Status Checklist

### Phase 1: Foundation
- [ ] TypeScript configuration
- [ ] Base interfaces & types
- [ ] Playwright bridge implementation
- [ ] Test framework structure

### Phase 2: Core Orchestrator
- [ ] Agent loop logic
- [ ] Planner module
- [ ] Generator module
- [ ] Prompt templates

### Phase 3: AI Integration
- [ ] AI provider SDK installed
- [ ] Prompt optimization
- [ ] End-to-end planning flow

### Phase 4: Healing & Intelligence
- [ ] Healer implementation
- [ ] Failure detection
- [ ] Auto-repair system

### Phase 5: Testing & Polish
- [ ] Integration tests
- [ ] Documentation
- [ ] Example suites

## 📦 Current Dependencies
```json
{
  "playwright": "^1.60.0",
  "typescript": "^6.0.3",
  "ts-node": "^10.9.2",
  "@types/node": "^25.9.1"
}
```

⚠️ **TO ADD**: AI Provider SDK (Anthropic or OpenAI)

## 🚀 Quick Start Commands
```bash
# Install dependencies
npm install

# Add AI provider
npm install @anthropic-ai/sdk
# OR
npm install openai

# Compile TypeScript
npm run build

# Run tests
npm run test
```

## Key Workflow

### Testing Orchestration Flow
```
User Input/Requirements
    ↓
[PLANNER] - AI analyzes and creates test plan
    ↓
[GENERATOR] - AI generates Playwright test code
    ↓
[PLAYWRIGHT BRIDGE] - Execute tests
    ↓
Test Results
    ↓
[HEALER] - If failed, analyze and repair
    ↓
[AGENT LOOP] - Retry or report
```

## 🔑 Important Configuration

### Module Type
- **Using CommonJS** (`"type": "commonjs"` in package.json)
- TypeScript compiles to CommonJS

### TypeScript Version
- Using **TypeScript 6.0.3** (strict mode expected)

### Environment Variables (To Be Created)
```
AI_PROVIDER=anthropic  # or openai
AI_API_KEY=xxx
PLAYWRIGHT_TIMEOUT=30000
BROWSER_TYPE=chromium
HEADLESS=true
```

## 📝 File References

| File | Purpose |
|------|---------|
| `ARCHITECTURE_PLAN.md` | Complete implementation roadmap & phases |
| `CONTEXT_POINTER.md` | This file - session context reminder |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `.env.example` | Environment variables template |
| `.gitignore` | Git ignore rules |

## 🤔 Session Checklist

When starting a new session:
1. ✅ Read `CONTEXT_POINTER.md` (you are here)
2. ⬜ Check `ARCHITECTURE_PLAN.md` for current phase
3. ⬜ Review `package.json` for dependencies
4. ⬜ Check which Phase you're implementing
5. ⬜ Reference component modules as needed

## 🔗 Related Resources
- [Playwright Docs](https://playwright.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Anthropic API](https://docs.anthropic.com) or [OpenAI API](https://platform.openai.com/docs)

## 📞 Quick Notes for Developers
- All new features should follow the 5-module architecture
- Prompts are stored as markdown templates in `src/prompts/`
- Generated tests go into `playwright/tests/`
- Page Object Models go into `playwright/pages/`
- TypeScript strict mode is enabled

---

**Last Updated**: May 22, 2026
**Current Implementer**: [Your Name]
**Project Stage**: Phase 1 - Foundation Setup

