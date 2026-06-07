// src/config.ts
import * as fs from 'fs';
import * as path from 'path';
import type { OrchestratorConfig } from './orchestrator/types';

function parseBool(value: any, fallback: boolean): boolean {
    if (value === undefined || value === null) return fallback;
    if (typeof value === 'boolean') return value;
    return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function parseIntOr(value: any, fallback: number): number {
    if (value === undefined || value === null) return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

let fileConfig: Partial<OrchestratorConfig> = {};
let rawExtra: any = {}; // for non-typed extras like baseUrl

try {
    const cfgPath = path.resolve(process.cwd(), 'config', 'config.json');
    if (fs.existsSync(cfgPath)) {
        const raw = fs.readFileSync(cfgPath, 'utf8');
        const parsed = JSON.parse(raw);
        // Keep typed part and extras
        const { browser, ai, logging, retryAttempts, ...rest } = parsed as any;
        fileConfig = {
            browser,
            ai,
            logging,
            retryAttempts,
        };
        rawExtra = rest ?? {};
    } else {
        // No config file present — fileConfig remains empty (defaults will apply)
    }
} catch (err) {
    // If the JSON is invalid, throw an explicit error to make misconfiguration obvious
    throw new Error(`Failed to read or parse config/config.json: ${String(err)}`);
}

// Defaults
// Build AI config without including undefined fields (to satisfy strict optional typing)
const aiConfig: any = {
    provider: (fileConfig?.ai?.provider as any) ?? 'openai',
    apiKey: fileConfig?.ai?.apiKey ?? '',
};
if (fileConfig?.ai?.model !== undefined) aiConfig.model = fileConfig.ai.model;
aiConfig.maxTokens = parseIntOr(fileConfig?.ai?.maxTokens, 2048);

// Build logging config, omit filePath when undefined
const loggingConfig: any = {
    level: (fileConfig?.logging?.level as any) ?? 'info',
};
if (fileConfig?.logging?.filePath !== undefined) loggingConfig.filePath = fileConfig.logging.filePath;

const finalConfig: OrchestratorConfig = {
    browser: {
        type: (fileConfig?.browser?.type as any) ?? 'chromium',
        headless: parseBool(fileConfig?.browser?.headless, true),
        timeout: parseIntOr(fileConfig?.browser?.timeout, 30000),
    },
    ai: aiConfig,
    logging: loggingConfig,
    retryAttempts: parseIntOr(fileConfig?.retryAttempts, 1),
};

// Export extras (like baseUrl) via a separate getter to avoid changing OrchestratorConfig type
export function getRawExtras(): Record<string, any> {
    return rawExtra;
}

export function getConfig(): OrchestratorConfig {
    return finalConfig;
}

export default finalConfig;