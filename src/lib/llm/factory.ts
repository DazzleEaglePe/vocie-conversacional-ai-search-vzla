// ─── LLM Factory (Factory Pattern + DIP) ─────────────────────────────────────
// Swappear de Gemini a Anthropic = cambiar LLM_PROVIDER=anthropic en .env.local
// El resto del sistema no sabe ni le importa qué provider está corriendo.

import { GeminiProvider } from './gemini-provider';
import { AnthropicProvider } from './anthropic-provider';
import type { ILLMProvider } from './types';

export function createLLMProvider(): ILLMProvider {
  const provider = process.env.LLM_PROVIDER ?? 'gemini';

  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider();
    case 'gemini':
    default:
      return new GeminiProvider();
  }
}
