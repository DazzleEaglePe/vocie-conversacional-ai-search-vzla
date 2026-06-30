// ─── Gemini Provider (desarrollo / free tier) ────────────────────────────────
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ILLMProvider, LLMMessage, LLMResponse } from './types';

export class GeminiProvider implements ILLMProvider {
  private client: GoogleGenerativeAI;

  constructor() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY no está definida en .env.local');
    this.client = new GoogleGenerativeAI(key);
  }

  async chat(messages: LLMMessage[], systemPrompt: string): Promise<LLMResponse> {
    const model = this.client.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    // Gemini requiere que el historial comience siempre con un mensaje del usuario ('user').
    // Removemos el primer mensaje si es del asistente (como el saludo inicial) para cumplir con esta validación.
    let llmMessages = messages;
    if (llmMessages.length > 0 && llmMessages[0].role === 'assistant') {
      llmMessages = llmMessages.slice(1);
    }

    // Gemini usa history separado del último mensaje
    const history = llmMessages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = llmMessages[llmMessages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return { content: text };
  }
}
