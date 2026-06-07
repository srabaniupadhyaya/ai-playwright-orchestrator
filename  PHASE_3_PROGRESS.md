# Phase 3 Progress — AI Integration (status snapshot)

Date: 2026-06-07  
Status: In progress (Gemini integration scaffolded)

## Objective (Phase 3)
Integrate an LLM provider so Planner and Generator produce real, actionable test plans and TypeScript Playwright tests from natural-language requirements.

## What has been implemented so far
- Gemini client scaffold:
    - `src/orchestrator/ai-client.ts` — `GeminiClient` implementing `AIProviderClient` interface (scaffold for Google Gemini)
    - Provides `generateText`, `generateJSON`, and `embedText` (embed is a mock placeholder)
- Planner updated to accept AI client:
    - `src/orchestrator/planner.ts` updated to accept an `AIProviderClient` constructor parameter and to call `aiClient.generateJSON<TestPlan>(prompt)` (with runtime validation and fallback mock)
- Generator expects AI client:
    - `src/orchestrator/generator.ts` already accepts an `AIProviderClient` and calls `generateJSON` (fallback to mock code if AI fails)
- AgentLoop now constructs a Gemini client and passes it to Planner & Generator:
    - `src/orchestrator/agent-loop.ts` creates `GeminiClient` with `config.ai.apiKey` and `config.ai.model`, then `new Planner(aiClient)` and `new Generator(aiClient)`
- Prompt templates were drafted (prompt examples provided in prior messages). Use files under `src/prompts/` to control generation.
- Config updated:
    - `config/config.json` includes `ai` block (provider, apiKey, model, maxTokens)

## What remains to finish Phase 3
- Install and configure Google Gemini SDK (or your chosen provider SDK) in the repo:
    - `npm install @google/generative-ai` or appropriate package
- Create and save prompt template files (recommended):
    - `src/prompts/test-planning.md`
    - `src/prompts/test-generation.md`
    - `src/prompts/healing.md` (for Phase 4)
- Move API keys out of repo and into secure storage (CI secrets or local secure `.env` not checked in)
    - If you exposed a key in `config/config.json` — rotate it immediately
- Tune prompts and implement retries / timeouts / error handling for AI calls
- Add schema validation (e.g., zod) for AI JSON outputs to reduce runtime errors
- Add caching / rate-limiting for AI calls (optional, for cost control)
- Create end-to-end tests (phase 3 live pipeline) and iterate on prompts

## Quick actions to finalize Phase 3
1. Install SDK:
```powershell
npm install @google/generative-ai
```
2. Ensure `config/config.json` no longer contains sensitive API key (move to secrets).
3. Add prompt files:
- `src/prompts/test-planning.md` — the planning prompt template
- `src/prompts/test-generation.md` — test generation prompt template
4. Run a real AI-driven run (after providing API key in a secure place):
```powershell
npx ts-node src/index.ts "Test login with valid credentials"
```
5. Review generated files in `playwright/tests/` and `playwright/pages/`, iterate prompt.

## Security note (IMPORTANT)
Your `config/config.json` currently shows an API key. Do not leave provider keys in the repo. Rotate that key now and use CI secrets / environment variables for runtime secrets.

## Recommended next steps for me to implement (pick one)
- A) Add environment overrides to `src/config.ts` (CI-friendly)
- B) Create `src/prompts/` files with tuned templates for Gemini
- C) Add zod-based validation for Planner/Generator AI outputs
- D) Provide GitHub Actions sample workflow that injects secrets and runs the orchestrator