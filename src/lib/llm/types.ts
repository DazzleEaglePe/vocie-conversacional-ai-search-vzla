// ─── LLM Provider Abstraction (SOLID: Dependency Inversion Principle) ────────
// La app depende de esta interfaz, no de Gemini ni Anthropic directamente.
// Swappear de proveedor = cambiar LLM_PROVIDER en .env.local, sin tocar el resto.

export interface LLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
}

// Contrato que todo provider debe cumplir (Open/Closed + Liskov Substitution)
export interface ILLMProvider {
  chat(messages: LLMMessage[], systemPrompt: string): Promise<LLMResponse>;
}
