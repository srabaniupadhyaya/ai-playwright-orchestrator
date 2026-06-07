// src/orchestrator/ai-client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PromptContext, AIProviderClient } from './types';

export class GeminiClient implements AIProviderClient {
    private client: GoogleGenerativeAI;
    private modelName: string;

    constructor(apiKey: string, modelName: string = 'gemini-2.0-flash') {
        if (!apiKey) {
            throw new Error('Gemini API key is required');
        }
        this.client = new GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
    }

    /**
     * Generate plain text response from Gemini
     */
    async generateText(prompt: string, _context?: PromptContext): Promise<string> {
        try {
            const model = this.client.getGenerativeModel({ model: this.modelName });
            const result = await model.generateContent(prompt);
            const response = result.response;
            return response.text();
        } catch (err) {
            throw new Error(`Gemini text generation failed: ${String(err)}`);
        }
    }

    /**
     * Generate JSON response from Gemini (forces output as JSON)
     */
    async generateJSON<T = any>(prompt: string, _context?: PromptContext): Promise<T> {
        try {
            const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON, no markdown, no extra text.`;
            const model = this.client.getGenerativeModel({
                model: this.modelName,
                generationConfig: {
                    responseMimeType: 'application/json',
                },
            });
            const result = await model.generateContent(jsonPrompt);
            const response = result.response;
            const text = response.text();
            return JSON.parse(text) as T;
        } catch (err) {
            throw new Error(`Gemini JSON generation failed: ${String(err)}`);
        }
    }

    /**
     * Embed text (optional, not used yet but part of interface)
     */
    async embedText(text: string): Promise<number[]> {
        // Gemini doesn't have embedding in free tier; return mock for now
        console.warn('embedText not implemented for Gemini; returning mock embedding');
        return Array(768).fill(0).map(() => Math.random());
    }
}

export default GeminiClient;