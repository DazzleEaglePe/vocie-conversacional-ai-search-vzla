// ─── Anthropic Provider (producción) ─────────────────────────────────────────
import Anthropic from '@anthropic-ai/sdk';
import type { ILLMProvider, LLMMessage, LLMResponse } from './types';

export class AnthropicProvider implements ILLMProvider {
  private client: Anthropic;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY no está definida en .env.local');
    this.client = new Anthropic({ apiKey: key });
  }

  async chat(messages: LLMMessage[], systemPrompt: string): Promise<LLMResponse> {
    // Anthropic requiere que el historial comience siempre con un mensaje del usuario ('user').
    // Removemos el primer mensaje si es del asistente (como el saludo inicial) para cumplir con esta validación.
    let llmMessages = messages;
    if (llmMessages.length > 0 && llmMessages[0].role === 'assistant') {
      llmMessages = llmMessages.slice(1);
    }

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: llmMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Respuesta inesperada de Anthropic');

    return { content: content.text };
  }
}
